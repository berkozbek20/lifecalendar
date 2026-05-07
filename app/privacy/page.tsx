import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gizlilik Politikası | Hayat Takvimi",
  description: "Hayat Takvimi uygulamasının gizlilik politikası.",
};

export default function PrivacyPage() {
  return (
    <main className="privacy-page">
      <article className="privacy-document">
        <Link className="privacy-back-link" href="/">
          Ana sayfa
        </Link>

        <p className="eyebrow">Gizlilik Politikası</p>
        <h1>Hayat Takvimi Gizlilik Politikası</h1>
        <p className="privacy-updated">Son güncelleme: 7 Mayıs 2026</p>

        <section>
          <h2>Veri Toplama</h2>
          <p>
            Hayat Takvimi kişisel verilerinizi toplamaz, satmaz veya üçüncü taraflarla paylaşmaz.
            Uygulamada hesap oluşturma, giriş yapma veya sunucu tarafında kullanıcı profili tutma
            özelliği yoktur.
          </p>
        </section>

        <section>
          <h2>Cihazda Saklanan Bilgiler</h2>
          <p>
            Doğum tarihi, beklenen yaşam süresi, hedef ayarları, widget tercihleri ve duvar kağıdı
            tercihleri yalnızca cihazınızda saklanır. Bu bilgiler geliştiriciye gönderilmez.
          </p>
        </section>

        <section>
          <h2>Satın Almalar</h2>
          <p>
            Uygulama içi satın almalar ve abonelikler Apple App Store tarafından işlenir. Hayat
            Takvimi ödeme kartı bilgilerinizi almaz veya saklamaz.
          </p>
        </section>

        <section>
          <h2>Destek İletişimi</h2>
          <p>
            Destek için bizimle iletişime geçerseniz, yalnızca sizin gönüllü olarak gönderdiğiniz
            bilgileri yanıt vermek amacıyla kullanırız.
          </p>
        </section>

        <section>
          <h2>Değişiklikler</h2>
          <p>
            Bu gizlilik politikası gerektiğinde güncellenebilir. Güncel sürüm her zaman bu sayfada
            yayınlanır.
          </p>
        </section>
      </article>
    </main>
  );
}
