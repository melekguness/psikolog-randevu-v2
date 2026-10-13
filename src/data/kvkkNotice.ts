import { APP_NAME, municipality } from "@/data/municipality";

export type KvkkSection = {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

export const KVKK_NOTICE_INTRO = `6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında ${municipality.shortName} tarafından yürütülen ${APP_NAME} hakkında bilgilendirme.`;

export const KVKK_NOTICE_SECTIONS: KvkkSection[] = [
  {
    id: "controller",
    title: "Veri sorumlusu",
    paragraphs: [
      `${municipality.name}\n${municipality.address}\nTelefon: ${municipality.phone} · E-posta: ${municipality.email}`,
    ],
  },
  {
    id: "data",
    title: "İşlenen kişisel veriler",
    bullets: [
      "Kimlik: ad, soyad",
      "İletişim: cep telefonu numarası (SMS doğrulama) ve isteğe bağlı e-posta",
      "Randevu: hizmet türü, uzman, tarih ve saat",
      "Açık rıza kaydı: aydınlatma metninin onaylandığına dair işlem bilgisi",
    ],
  },
  {
    id: "purpose",
    title: "İşleme amaçları",
    bullets: [
      "Diyetisyen ve psikolog randevularının oluşturulması",
      "Telefon doğrulama ve randevu bilgilendirmesi",
      "Hizmetin yürütülmesi ve yasal yükümlülüklerin yerine getirilmesi",
    ],
  },
  {
    id: "legal",
    title: "Hukuki sebep",
    paragraphs: [
      "Veriler; kamu hizmetinin yürütülmesi, ilgili kişinin açık rızası ve temel hak ve özgürlüklere zarar vermemek kaydıyla meşru menfaat hukuki sebeplerine dayanılarak işlenir. Sistemde kullanıcı hesabı oluşturulmaz.",
    ],
  },
  {
    id: "transfer",
    title: "Aktarım ve saklama",
    paragraphs: [
      "Verileriniz, randevu sürecinin gerektirdiği ölçüde yetkili personel ile paylaşılabilir. Saklama süresi ilgili mevzuat ve hizmet ihtiyacı ile sınırlıdır; süre sonunda silinir veya anonim hale getirilir.",
    ],
  },
  {
    id: "rights",
    title: "Haklarınız",
    paragraphs: [
      `KVKK'nın 11. maddesi kapsamında verilerinizin işlenip işlenmediğini öğrenme, düzeltme, silme ve itiraz etme haklarına sahipsiniz. Başvurularınızı ${municipality.email} adresine iletebilirsiniz.`,
    ],
  },
];

export const KVKK_CONSENT_LABEL =
  "KVKK Aydınlatma Metni’ni okudum.";
