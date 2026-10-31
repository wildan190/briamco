# Panduan CMS BRIAMCO

Frontend: http://127.0.0.1:5173/
CMS: http://localhost:1337/admin

13 bagian halaman, 11 layanan, 2 Blog dan 1 News telah disimpan dan dipublikasikan di PostgreSQL lokal. Tema, CSS dan urutan komponen halaman dipertahankan. Konten asli BRIAMCO mengambil inspirasi struktur layanan advisory dari https://www.teneo.com/ tanpa menggunakan identitas atau profil Teneo.

## Mengedit konten

1. Masuk ke admin Strapi menggunakan akun admin yang sudah ada.
2. Buka Content Manager → Website Section, pilih bagian halaman. Jangan mengubah slug.
3. Edit field `content` (JSON). Peta key dan isi awal tersedia di bawah. Pertahankan nama key dan struktur objek/list.
4. Save, lalu Publish. Muat ulang frontend untuk melihat hasil.
5. Artikel dikelola melalui Article: pilih `type` blog atau news, isi title, slug, description, content, author, category, date, cover atau imageUrl. Publish agar muncul pada Insight dan halaman detail. Dua artikel published terbaru tampil di homepage.
6. Pesan formulir masuk ke Contact Inquiry. Status dapat diubah menjadi new, in-progress, atau closed. Tidak ada endpoint publik untuk membaca pesan.

## Menjalankan proyek

Backend: dari folder briamco-strapi jalankan `docker compose up -d`. Frontend: dari folder web-briamco jalankan `npm run dev -- --host 127.0.0.1`. Untuk host CMS berbeda, isi `VITE_STRAPI_URL` dalam `.env` frontend, lalu restart/rebuild frontend.

Seed berjalan saat startup dan hanya membuat entri yang belum ada, tanpa menimpa edit CMS. `SEED_WEBSITE_CONTENT=false` menonaktifkan seed. Tidak perlu memasukkan token admin ke frontend.

## Isi yang perlu dilengkapi

Profil tim, alamat kantor, ilustrasi engagement, logo mitra serta tautan sosial/legal masih menggunakan isian awal atau placeholder. Ganti dengan data resmi BRIAMCO. Navbar sekarang menggunakan halaman tersendiri. Services memiliki dropdown dari koleksi Service yang published. Testimonials tidak ada di navbar; section homepage tetap dipertahankan. Pergantian EN/ID mengikuti perilaku frontend semula, belum menerjemahkan konten. Gambar tetap menggunakan URL aset yang sudah ada; cover artikel mendukung Media Library.

## Verifikasi

Build dan type-check Vue lulus; 7 unit tests lulus. API konten mengembalikan 13 bagian; API halaman menyediakan 11 layanan, 2 Blog dan 1 News beserta detail slug. Formulir valid menghasilkan HTTP 201 dan record database; input tidak valid HTTP 400. Record uji sudah dihapus. Tema navy, font, komponen homepage dan layout utama tetap dipakai. CSS tambahan mendukung dropdown dan halaman detail. Alur klik desktop/mobile serta refresh URL News diperiksa di browser.

## Halaman dan URL

| Halaman | URL |
| --- | --- |
| Home | `/` |
| About | `/about` |
| Services | `/services` |
| Detail layanan | `/services/:slug` |
| Solutions | `/solutions` |
| Contact | `/contact` |
| Semua Insight | `/insight` |
| Blog | `/insight/blog` |
| News | `/insight/news` |
| Detail Blog | `/insight/blog/:slug` |
| Detail News | `/insight/news/:slug` |

## Mengelola layanan

Content Manager → Service. Isi title, slug unik, group, description, content (Markdown), features (list JSON), image dari Media Library atau imageUrl, imageAlt dan order. Save lalu Publish. Dropdown dan daftar layanan menggunakan data published; setiap slug membuka halaman detail tersendiri. Group menentukan kelompok layanan di dropdown.

Article menggunakan koleksi yang sama untuk Blog dan News; `type` menentukan kategori dan URL detail. Slug menjadi alamat permanen; perubahan judul tidak perlu mengubah slug. Draft tidak ditampilkan pada endpoint publik. Artikel lama dimigrasikan sebagai Blog tanpa mengubah isi editorialnya. Pesan kontak tetap privat.

Untuk deployment frontend, konfigurasikan hosting agar route Vue mengarah ke index.html, misalnya Nginx `try_files $uri $uri/ /index.html;`, agar refresh halaman slug berfungsi. `VITE_STRAPI_URL` harus menunjuk alamat CMS yang bisa diakses browser pengguna.

## Peta field konten

### AboutSection

| Key | Isi awal / struktur |
| --- | --- |
| points | List 3 item |
| src1 | https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=900&q=80 |
| alt2 | Software engineering team collaborating on distributed systems |
| src3 | https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=600&q=80 |
| alt4 | Tech architects reviewing system design diagrams |
| text5 | 360° |
| text6 | Business Perspective |
| text7 | About BRIAMCO |
| text8 | An Integrated Perspective |
| text9 | on Your Business Priorities |
| text10 | BRIAMCO connects strategic advice with technology expertise to help organizations make informed decisions and turn complex challenges into actionable plans. We work alongside leadership teams, aligning business prioritie |
| text11 | Build With Us |

### BlogSection

| Key | Isi awal / struktur |
| --- | --- |
| articles | List 2 item |
| text1 | NEWS & INSIGHTS |
| text2 | Perspectives on  |
| text3 | Business, Change  |
| text4 | & Leadership |
| text5 | Explore original BRIAMCO perspectives on strategy, transformation, technology and risk. |
| text6 | Explore Insights |
| text7 | Read More |

### ContactSection

| Key | Isi awal / struktur |
| --- | --- |
| src1 | https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80 |
| alt2 | Diverse corporate leadership team reviewing business strategy on laptop |
| text3 | DISCUSS YOUR BUSINESS PRIORITIES |
| text4 | Ready to Navigate Change? |
| text5 | Let’s Discuss Your Business Goals |
| text6 | Address |
| text7 | Office details to be confirmed |
| text8 | Contact us using the form |
| text9 | Contact |
| href10 | mailto:solutions@briamco.com |
| text11 | solutions@briamco.com |
| href12 | #contact |
| text13 | Use the consultation form |
| text14 | Consultation Requested! |
| text15 | Thank you, |
| text16 | . Your inquiry has been saved for the BRIAMCO team to review. |
| text17 | Send Another Request |
| text18 | Schedule a Consultation |
| text19 | Integrated Perspective |
| text20 | Practical Roadmap |
| text21 | Clear Priorities |
| placeholder22 | Your Name |
| placeholder23 | Email |
| placeholder24 | Subject |
| placeholder25 | Write a Message |

### CtaBanner

| Key | Isi awal / struktur |
| --- | --- |
| stats | List 4 item |
| text1 | Ready to Transform? |
| text2 | Building Resilient Businesses |
| text3 | for the Future |
| text4 | Connect strategic thinking with practical execution. Discuss how BRIAMCO can support your next business priority. |
| text5 | Schedule Consultation |
| text6 | Explore Solutions |

### FaqSection

| Key | Isi awal / struktur |
| --- | --- |
| faqs | List 5 item |
| text1 | Got Questions? |
| text2 | Frequently Asked Questions |
| text3 | Learn how BRIAMCO connects strategic advice with technology and practical execution. |

### FooterSection

| Key | Isi awal / struktur |
| --- | --- |
| footerLinks | Objek: Services, Company, Explore |
| src1 | /logo.svg |
| alt2 | BRIAMCO Logo |
| text3 | Connecting strategy, technology and practical execution to help organizations navigate change and build lasting value. |
| text4 | © |
| text5 | BRIAMCO. All rights reserved. |
| text6 | Privacy Policy |
| text7 | Terms of Service |
| text8 | Cookie Policy |

### HeroSection

| Key | Isi awal / struktur |
| --- | --- |
| marqueeItems | List 5 item |
| stats | List 4 item |
| href1 | mailto:hello@briamco.com |
| text2 | hello@briamco.com |
| text3 | Contact BRIAMCO for office details |
| text4 | Mon–Fri, 08:00–17:00 WIB |
| text5 | STRATEGY, TECHNOLOGY & BUSINESS ADVISORY |
| text6 | Helping Leaders Navigate Change |
| text7 | and Build Lasting Value |
| text8 | BRIAMCO brings strategy, technology and practical execution together to help business leaders navigate complexity, strengthen resilience and pursue sustainable growth. |
| text9 | Discuss Your Business Priorities |
| text10 | JL |
| text11 | MS |
| text12 | AK |
| text13 | Strategy connected to practical execution |
| src14 | https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&w=1800&q=80 |
| alt15 | Enterprise engineers and technology leads collaborating in modern development lab |

### NavBar

| Key | Isi awal / struktur |
| --- | --- |
| navLinks | List 6 item; route navbar dikelola aplikasi |
| src1 | /logo.svg |
| alt2 | BRIAMCO Logo |
| text3 | EN |
| text4 | ID |
| text5 | English (EN) |
| text6 | Bahasa (ID) |

### ServicesSection

| Key | Isi awal / struktur |
| --- | --- |
| tabs | List 3 item |
| text1 | Explore Our Service |
| text2 | What We are Offering |
| text3 | to Our Potential Client |
| text4 | Integrated advice for business leaders across strategy, transformation, finance, risk and organization, supported by technology expertise and a focus on execution. |
| text5 | View All Services |
| text6 | ( |
| text7 | ) |
| text8 | Service Details |

### SolutionsSection

| Key | Isi awal / struktur |
| --- | --- |
| solutions | List 2 item |
| text1 | Tailored Solutions |
| text2 | Advice for Every Stage of Change |
| text3 | Connect business priorities with an actionable roadmap, whether you are building for growth or transforming an established organization. |
| text4 | Get Started |

### TeamSection

| Key | Isi awal / struktur |
| --- | --- |
| team | List 4 item |
| text1 | Our People |
| text2 | Meet Our Advisory Perspectives |
| text3 | Illustrative advisory profiles show how complementary perspectives can support your priorities. Confirmed team biographies can be maintained here through the CMS. |
| text4 | in |
| text5 | @ |

### TestimonialsSection

| Key | Isi awal / struktur |
| --- | --- |
| testimonials | List 4 item |
| src1 | https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1800&q=80 |
| alt2 | High-tech enterprise datacenter and cloud facility |
| text3 | Engagement Perspectives |
| text4 | Connecting Advice with Business Priorities |
| text5 | Illustrative engagement themes show how strategy, transformation, risk and people can work together. These are editorial examples, not client endorsements. |

### TrustedBySection

| Key | Isi awal / struktur |
| --- | --- |
| text1 | Focused on |
| text2 | business |
| text3 | priorities & leadership teams |
| text4 | MARKETING |
| text5 | AGENCY SLOGAN |
| text6 | Carriest |
| text7 | SLOGAN HERE |
| text8 | Alohu |
| text9 | THE GAME |
| text10 | Minest |
| text11 | AUTOMATION |
| text12 | Success |
| text13 | GOOD PEOPLE |
| text14 | Minest |
| text15 | AUTOMATION |


## Preview CMS

Preview sudah diaktifkan untuk Article (Blog/News), Service, dan Website Section. Buka entri di Content Manager, simpan perubahan dengan **Save**, lalu klik **Preview**. Artikel dan layanan membuka halaman sesuai slug; Website Section membuka halaman yang terkait atau homepage. Konten draft hanya dapat diambil dengan tautan preview bertanda tangan yang berlaku 30 menit. Pengunjung biasa tetap menerima konten published. Gunakan **Exit preview** untuk kembali ke tampilan publik.

Preview ini menampilkan draft yang sudah disimpan. Live Preview untuk perubahan yang belum disimpan merupakan fitur paket Growth/Enterprise Strapi. URL frontend lokal default: `http://127.0.0.1:5173`. Untuk deployment, atur `CLIENT_URL` pada environment server Strapi ke domain frontend.

## Navbar dari CMS

Buka **Content Manager → Navigation Item**. Setiap item memiliki:

- `label`: teks menu EN.
- `labelId`: teks menu ID (jika kosong memakai label EN).
- `href`: URL halaman internal, misalnya `/about`, `/services`, `/insight`, atau `/contact`.
- `type`: `link` untuk tautan biasa; `services` untuk dropdown daftar layanan.
- `order`: angka lebih kecil tampil lebih awal.
- `visible`: aktifkan untuk menampilkan menu; nonaktifkan untuk menyembunyikannya.

Isi label dan URL, lalu **Save → Publish**. Urutan, label, dan item yang tampil mengikuti koleksi ini pada desktop maupun mobile. Item baru boleh ditambahkan; item yang dihapus tidak dibuat ulang saat server restart. Field `key` opsional. Pengaturan logo dan label tombol bahasa tetap berada di Website Section → NavBar.

## Konten EN dan ID

Website Section, Service, dan Article sudah menggunakan i18n bawaan Strapi dengan locale **English (en)** dan **Indonesian (id)**. Pilih locale pada Content Manager untuk mengedit versi bahasa yang diinginkan. Simpan dan publish setiap bahasa secara terpisah. Konten awal ID untuk 13 Website Section, 11 Service, dan 3 Article sudah ditanamkan; versi EN yang sebelumnya diedit tetap dipertahankan. Gunakan slug yang sama pada EN dan ID agar tautan halaman tetap konsisten saat berganti bahasa.

Pada kunjungan pertama, browser dengan bahasa/region Indonesia atau zona waktu Jakarta, Pontianak, Makassar, dan Jayapura mendapat ID; lainnya mendapat EN. Ini memakai informasi browser/perangkat, bukan lokasi geografis IP. Pilihan manual EN/ID disimpan di browser dan lebih diutamakan pada kunjungan berikutnya. URL `?lang=en` atau `?lang=id` dapat digunakan untuk membuka atau memeriksa bahasa tertentu. Preview CMS otomatis memakai locale entri yang dipilih.

Validasi: build frontend dan Strapi admin berhasil, 10 tes unit berhasil, serta API EN/ID dan pergantian bahasa pada homepage, dropdown, detail layanan, dan detail News diperiksa.


## Business Partner / clients

Buka Content Manager → Business Partner → Create new entry. Isi `name`, upload gambar pada `logo`, isi `logoAlt`, dan tambahkan `website` (opsional, URL http/https). `order` mengatur urutan dari angka terkecil, dan `visible` mengatur apakah partner tampil. Klik Save lalu Publish agar tampil di website. Logo upload diprioritaskan; `imageUrl` dapat dipakai sebagai alternatif.

Enam logo contoh dari desain sebelumnya sudah dimigrasikan dengan `isExample=true`. Ganti dengan partner bisnis yang sebenarnya dan ubah `isExample` menjadi false. Menghapus partner tidak membuat contoh tersebut muncul kembali. Nama dan logo partner digunakan bersama untuk EN/ID; judul section tetap di Website Section → TrustedBySection per bahasa.
