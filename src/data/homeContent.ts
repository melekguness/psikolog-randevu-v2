import { municipality } from "@/data/municipality";

export const HOME_FAQ = [
  {
    id: "free",
    question: "Hizmetler ücretsiz mi?",
    answer: `Evet. Atakum Belediyesi Sağlık İşleri Müdürlüğü, Atakum sakinlerine diyetisyen ve psikolog randevularını ücretsiz sunar.`,
  },
  {
    id: "who",
    question: "Kimler randevu alabilir?",
    answer:
      "Hizmet Atakum sakinlerine yöneliktir. Randevu için ad soyad ve doğrulanmış cep telefonu yeterlidir; görüşmeye gelirken kimlik belgesi zorunludur.",
  },
  {
    id: "hours",
    question: "Çalışma saatleri nedir?",
    answer: `Merkez çalışma saatleri ${municipality.workingHours}. Müsait seanslar bu çerçevede, uzman takvimine göre listelenir.`,
  },
  {
    id: "how",
    question: "Randevu nasıl alınır?",
    answer:
      "Hizmeti seçin, uygun saati belirleyin, telefonunuzu SMS ile doğrulayın ve KVKK onayını verin.",
  },
] as const;

export const HOME_PROCESS_STEPS = [
  {
    id: 1,
    label: "Uzmanını seç",
    short: "Psikolog veya diyetisyen birimini seçerek başlayın.",
  },
  {
    id: 2,
    label: "Tarih ve saatini seç",
    short: "Müsait gün ve saatten size uygun olanı belirleyin.",
  },
  {
    id: 3,
    label: "SMS ile doğrula",
    short: "Telefonunuza gelen doğrulama kodunu girin.",
  },
  {
    id: 4,
    label: "Randevunu onayla",
    short: "KVKK onayını vererek randevunuzu tamamlayın.",
  },
] as const;

export const SERVICE_SUMMARIES = {
  dietitian: {
    title: "Diyetisyen",
    description:
      "Kişiye özel beslenme planı, sağlıklı kilo yönetimi ve metabolik denge.",
    motto: "Sağlıklı Beslenme ve Zinde Bir Yaşam İçin Adım Atın.",
    points: [
      "Kişiye özel beslenme",
      "Sağlıklı kilo yönetimi",
      "Metabolik denge",
      "Bireysel değerlendirme",
    ],
  },
  psychologist: {
    title: "Psikolog",
    description:
      "Stres, kaygı, tükenmişlik ve ilişki konularında bireysel psikolojik destek.",
    motto: "Zihinsel Denge ve Ruh Sağlığınız İçin Yanınızdayız.",
    points: [
      "Stres ve kaygı",
      "Tükenmişlik",
      "İlişki sorunları",
      "Gizlilik esaslı görüşme",
    ],
  },
} as const;
