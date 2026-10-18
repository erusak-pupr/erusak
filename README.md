# Website Pendataan Kondisi Bangunan Gedung — template gratis

Template ini memisahkan **input internal** dari **informasi publik** agar data internal tidak otomatis terbuka ke publik.

## Arsitektur yang disarankan

1. **Google Form internal**: petugas memasukkan hasil survei. Batasi responden ke akun Google petugas yang ditunjuk (fitur pembatasan akun tergantung jenis akun Google/Workspace).
2. **Google Sheets INTERNAL**: respons formulir, catatan teknis, dan tautan dokumentasi. Jangan publikasikan sheet ini ke web.
3. **Google Sheets PUBLIK TERPISAH**: salin secara manual hanya kolom/baris yang telah disetujui untuk publikasi. Jangan gunakan tab internal yang sama sebagai sumber publik.
4. **GitHub Pages**: menampilkan CSV dari sheet PUBLIK saja. Tidak ada endpoint publik untuk menulis ke spreadsheet internal.

> Penting untuk penggunaan dinas: pastikan mendapat persetujuan atasan/pengelola data dan mengikuti kebijakan keamanan informasi instansi sebelum menerbitkan data. Jangan masukkan alamat rinci, nama petugas, nomor kontak, data pribadi, dokumen internal, atau foto yang mengungkap informasi sensitif tanpa dasar dan persetujuan yang sesuai.

## Isi folder

- `index.html`: halaman publik
- `style.css`: tampilan responsif
- `config.js`: tempat menaruh URL CSV publik
- `app.js`: membaca dan memfilter data CSV
- `template_kolom_sheet.csv`: contoh kolom untuk sheet publik
- `template_form_internal.csv`: contoh daftar pertanyaan formulir internal

## Langkah A — Siapkan Google Form internal

1. Masuk ke akun Google yang diizinkan kantor.
2. Buat Google Form bernama `Form Survei Kondisi Bangunan`.
3. Tambahkan pertanyaan sesuai `template_form_internal.csv`. Untuk kolom pilihan, buat pilihan yang konsisten.
4. Pada tab **Respons**, pilih tautkan ke Google Sheets untuk membuat spreadsheet respons.
5. Di **Setelan**, aktifkan pembatasan responden/akun bila tersedia. Jangan memilih siapa saja dapat merespons jika form berisi data internal.
6. Uji dengan akun petugas yang ditunjuk. Pastikan orang di luar daftar tidak bisa mengisi bila kebijakan akun mendukungnya.
7. Simpan sheet internal dengan akses terbatas. Jangan klik “Publikasikan ke web” pada sheet internal.

## Langkah B — Buat sheet publik yang terpisah

1. Buat spreadsheet baru bernama `Rekap Publik Kondisi Bangunan`.
2. Salin header dari `template_kolom_sheet.csv` ke baris pertama.
3. Masukkan hanya data yang telah diperiksa dan disetujui untuk publikasi. Pilih data minimum yang diperlukan.
4. Untuk dokumentasi, gunakan tautan yang memang boleh dilihat publik. Ingat: siapa pun yang memiliki tautan dengan akses publik dapat membukanya.
5. Setelah mendapat persetujuan, pilih **File → Share → Publish to web** (nama menu dapat berbeda). Publikasikan hanya sheet publik ini sebagai CSV.
6. Salin URL CSV yang diberikan. Jangan pernah memakai URL sheet internal.

## Langkah C — Hubungkan website ke CSV publik

1. Buka `config.js` menggunakan Notepad.
2. Tempel URL CSV publik di antara tanda kutip setelah `publicCsvUrl:`.
3. Simpan file. Jangan menaruh kata sandi, token rahasia, atau URL spreadsheet internal di file ini.
4. Buka `index.html` di browser untuk uji awal. Bila browser memblokir permintaan lokal, langsung uji setelah dipasang di GitHub Pages.

## Langkah D — Terbitkan melalui GitHub Pages

1. Buat repository GitHub baru. Untuk GitHub Pages gratis, repository boleh publik; anggap seluruh file di dalamnya dapat dilihat siapa saja.
2. Unggah `index.html`, `style.css`, `config.js`, dan `app.js` ke root repository.
3. Buka **Settings → Pages**.
4. Di bagian build/deployment, pilih **Deploy from a branch**, branch `main`, folder `/(root)`, lalu Save.
5. Tunggu proses deployment. Alamat website akan muncul di halaman Pages.
6. Uji di HP dan komputer. Jangan mengunggah CSV internal atau dokumen survei ke repository.

## Format kolom sheet publik

Header yang dikenali oleh website:
- `nama bangunan`
- `kelurahan`
- `kecamatan`
- `status ringkas`
- `tanggal data`
- `tautan foto`

Kolom tambahan bisa ada, tetapi **jangan masukkan kolom rahasia** ke sheet publik karena CSV publik akan mengekspos semua kolom di sheet tersebut.

## Keamanan dan batasan

- GitHub Pages adalah website statis; halaman ini hanya membaca CSV publik dan tidak memiliki login.
- Jangan mencoba membuat “login” hanya dengan menyembunyikan tombol/URL di JavaScript. Itu bukan pengamanan.
- Jangan membuat Apps Script yang menerima penulisan data tanpa autentikasi kuat; URL endpoint yang terbuka dapat disalahgunakan.
- Google Forms + Sheets lebih mudah untuk MVP multi-petugas. Akses internal dikendalikan di Google, bukan oleh website publik.
- Sheet publik yang dipublikasikan bisa diakses siapa pun. Data yang sudah disalin ke sheet publik harus dianggap terbuka.
- Jika diperlukan akses dashboard internal, data rinci, riwayat perubahan, peran admin, atau unggah dokumen yang sensitif, gunakan platform yang disetujui instansi dan memiliki kontrol akses; jangan mengandalkan GitHub Pages saja.
- Jangan memasukkan data fiktif pada laporan resmi. Angka contoh di tampilan hanya placeholder.
