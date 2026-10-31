# BRIAMCO — Docker deployment

Target: VPS `163.227.96.70`, domain `subs.sicepot.com`.

## Persiapan satu kali

1. Pasang Docker Engine beserta plugin Docker Compose (v2 dengan dukungan `up --wait`), `openssl`, dan `curl` di VPS. Panduan resmi Docker: https://docs.docker.com/engine/install/ubuntu/
2. Buat DNS record **A**: `subs.sicepot.com` → `163.227.96.70`. Hapus/perbaiki record AAAA apabila belum memakai IPv6. Buka TCP **80 dan 443** pada firewall VPS/provider. Jika memakai Cloudflare, gunakan DNS only saat penerbitan sertifikat pertama.
3. Salin folder proyek lengkap ke VPS, misalnya `/opt/briamco`. Sertakan source frontend/backend, lockfile, folder `deploy`, dan script. Jangan menyalin `node_modules`, file `.env` lokal, `.tmp`, atau volume Docker lokal ke dalam image.
4. Pastikan tidak ada Nginx/Apache/container lain yang memakai port 80/443. Script tidak menghentikan service lain secara otomatis.

## Deploy baru

```bash
cd /opt/briamco
chmod +x deploy.sh backup.sh export-local.sh
./deploy.sh
```

Script membuat `.env.production` dengan secret acak pada pemakaian pertama, membangun frontend dan admin Strapi, menjalankan PostgreSQL/Strapi/frontend/Nginx, menerbitkan sertifikat Let's Encrypt, mengalihkan HTTP ke HTTPS, dan mengaktifkan renewal otomatis. Sertifikat diperiksa Nginx setiap 6 jam; Certbot mencoba renewal setiap 12 jam.

- Website: https://subs.sicepot.com
- Admin CMS: https://subs.sicepot.com/admin
- API: https://subs.sicepot.com/api/website-content

Database baru diisi konten awal dari seed proyek. Buka `/admin` untuk membuat akun admin pertama. SMTP belum dikonfigurasi; reset password melalui CLI tersedia di bawah.

`.env.production` dibuat sekali dan dipertahankan saat deploy ulang. Simpan file ini sebagai bagian dari backup rahasia. `LETSENCRYPT_EMAIL` opsional dapat diisi untuk akun sertifikat. Jika mengganti domain, ubah `DOMAIN` dan `PUBLIC_URL` bersama-sama lalu deploy ulang agar frontend/admin dibangun dengan alamat baru. Jangan mengganti password database pada file ini setelah database terinisialisasi tanpa memperbarui password PostgreSQL juga.

## Memindahkan data lokal yang sudah diedit

Jika ingin membawa konten CMS, inquiry, akun admin, dan unggahan yang sekarang, lakukan ini **sebelum** deploy pertama di VPS:

Di komputer lokal, dengan container pengembangan menyala:

```bash
cd /Users/wildanbelfiore/briamco
./export-local.sh
```

Script menghasilkan `backups/local-YYYYMMDD-HHMMSS/database.dump` dan `uploads.tar.gz`. Hindari pengeditan konten/upload saat ekspor. Salin direktori hasil ekspor tersebut secara aman ke VPS, misalnya `/opt/briamco/migration`, lalu:

```bash
cd /opt/briamco
./deploy.sh --import /opt/briamco/migration
```

Import hanya diterima untuk database produksi yang masih kosong. Script menolak menimpa database yang sudah berisi tabel. Akun admin hasil impor tetap memakai password yang sama. Secret produksi baru mengakhiri session lama; API token/integrasi lama mungkin perlu dibuat ulang. URL eksternal/localhost yang ditulis manual pada field konten perlu disesuaikan melalui CMS; unggahan media normal memakai URL produksi otomatis.

## Update berikutnya

```bash
cd /opt/briamco
./backup.sh
# Salin source versi baru tanpa menimpa .env.production, backups, atau konfigurasi runtime.
./deploy.sh
```

Volume database, upload dan sertifikat dipertahankan. Build dilakukan sebelum service diganti; pergantian service dapat menimbulkan jeda singkat. Script tidak menjalankan `down -v` atau menghapus volume. Jangan menjalankan dua deployment bersamaan.

## Operasional

```bash
# Status
 docker compose --env-file .env.production -f docker-compose.production.yml ps
# Log
 docker compose --env-file .env.production -f docker-compose.production.yml logs -f --tail=100 strapi nginx
# Backup database dan upload
 ./backup.sh
# Reset password admin secara interaktif
 docker compose --env-file .env.production -f docker-compose.production.yml exec strapi npm run strapi -- admin:reset-user-password
```

Password admin harus minimal 8 karakter, mengandung angka dan huruf besar. Jangan menaruh password sebagai argumen command.

PostgreSQL dan Strapi tidak memublikasikan port 5432/1337 ke internet. Hanya Nginx yang membuka 80/443. File upload tersimpan pada volume `briamco-production_uploads`; database pada `briamco-production_postgres_data`.

Jika sertifikat gagal diterbitkan, perbaiki DNS/akses port 80 dan jalankan `./deploy.sh` lagi. Sebelum HTTPS aktif, login admin produksi belum diharapkan berfungsi. Backup di folder `backups/` juga perlu disalin ke lokasi lain di luar VPS.

## Batas verifikasi

Konfigurasi ditargetkan untuk VPS Linux; penerbitan sertifikat dan akses domain harus diuji saat script benar-benar dijalankan di VPS. Tidak ada perubahan DNS atau deployment ke VPS yang dilakukan dari sesi ini.

Referensi konfigurasi reverse proxy Strapi: https://docs.strapi.io/cms/configurations/server dan https://docs.strapi.io/cms/configurations/admin-panel

Validasi lokal selesai: kedua image produksi berhasil dibangun; Strapi berjalan sebagai user non-root pada database PostgreSQL pengujian; endpoint konten, admin/init, halaman admin, serta rute SPA `/people` berhasil melewati Nginx HTTPS dengan sertifikat pengujian. Konfigurasi Compose, sintaks shell, penolakan import ke database non-kosong, dan 17 unit test frontend juga lolos. Penerbitan sertifikat Let's Encrypt asli belum dijalankan.
