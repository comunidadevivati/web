import { COMMUNITY_CONTACT } from '@/features/contact/domain/community-contact';
import type { GuestWifiTermsSection } from '@/features/guest-wifi/presentation/models/guest-wifi-terms.model';

// Tradução de cortesia dos termos. Em caso de divergência, prevalece a versão em português.
export const guestWifiTermsNoticeEnUS =
  'This is a courtesy translation. In case of any discrepancy, the Portuguese version prevails.';

export const guestWifiTermsEnUS: GuestWifiTermsSection[] = [
  {
    id: 'objeto',
    title: '1. About these terms',
    paragraphs: [
      'These Terms of Use and Privacy Policy govern access to the "VIVA - Visitantes" Wi-Fi network, offered free of charge by Comunidade Viva, as a courtesy, to visitors and attendees while they are on its premises.',
      'By checking the acceptance option and proceeding, you declare that you have read, understood and agree to all the conditions below. If you do not agree, do not use the network.',
    ],
  },
  {
    id: 'uso',
    title: '2. Network usage conditions',
    paragraphs: [
      'The network must be used ethically, responsibly and in accordance with Brazilian law and the values of Comunidade Viva. It is forbidden to use it to:',
    ],
    items: [
      'access, store or share illegal, pornographic, violent or discriminatory content, or content that incites hatred;',
      'download or share copyrighted content without authorization (piracy);',
      'carry out or attempt intrusions, attacks, scans, data interception or any action that compromises the security of the network or of third parties;',
      'send spam, scams or fraudulent messages, or commit any crime or unlawful act;',
      'make abusive use of the available bandwidth, harming other users.',
    ],
  },
  {
    id: 'servico',
    title: '3. Service characteristics',
    paragraphs: [
      'Access is free, personal and temporary, and may be limited in time, speed or data volume. Comunidade Viva may block websites and services, end connections and suspend the access of anyone who breaches these terms, at any time and without prior notice.',
      'The service is provided "as is", with no guarantee of availability, speed or continuity. As this is a shared network, we recommend not transmitting sensitive information without a secure connection (HTTPS) and keeping your device protected and up to date.',
    ],
  },
  {
    id: 'responsabilidade',
    title: '4. Responsibilities',
    paragraphs: [
      'You are solely responsible for your use of the network, for the content you access or transmit and for the security of your device. Comunidade Viva is not liable for damages, data loss, viruses or losses resulting from the use of the network, nor for third-party content accessed through it.',
      'In case of misuse, connection logs may be provided to the competent authorities upon legal request or court order, under the Brazilian Internet Civil Framework (Law No. 12,965/2014).',
    ],
  },
  {
    id: 'dados',
    title: '5. Personal data collected',
    paragraphs: [
      'In accordance with the Brazilian General Data Protection Law (LGPD, Law No. 13,709/2018), Comunidade Viva, as data controller, collects only the data needed to provide access:',
    ],
    items: [
      'data you provide: full name and phone number;',
      "technical connection data: your device's MAC and IP addresses, the network and equipment used, and the date, time and duration of access;",
      'a record of your acceptance of these terms, with the date, time and version of the text.',
    ],
  },
  {
    id: 'finalidades',
    title: '6. How we use your data',
    paragraphs: ['Your data is processed exclusively to:'],
    items: [
      'identify the user and unlock internet access (performance of the service you requested);',
      'keep the network secure, prevent fraud and investigate misuse (legitimate interest);',
      'keep connection logs for the period required by law and respond to requests from authorities (compliance with a legal obligation);',
      'occasionally contact you to thank you for your visit and share information about Comunidade Viva (legitimate interest). You can ask not to be contacted again at any time.',
    ],
  },
  {
    id: 'compartilhamento',
    title: '7. Sharing and storage',
    paragraphs: [
      'Comunidade Viva does not sell, rent or transfer your personal data. It may be processed by technology providers that operate the network and the system (such as equipment and cloud services), always limited to the purposes above, and shared with public authorities only when there is a legal obligation or court order.',
      'Connection logs are kept confidential, in a controlled environment, for the minimum period required by law. Other data is kept for as long as necessary for the stated purposes, for no more than 2 (two) years after your last access, and is then deleted or anonymized, unless there is a legal obligation to retain it.',
      'We adopt reasonable technical and administrative measures to protect your data against unauthorized access, loss or misuse.',
    ],
  },
  {
    id: 'direitos',
    title: '8. Your rights as a data subject',
    paragraphs: [
      `Under article 18 of the LGPD, you may, at any time and free of charge, request: confirmation that your data is being processed; access to your data; correction of incomplete, inaccurate or outdated data; anonymization, blocking or deletion of unnecessary data or data processed in breach of the law; data portability; information about who your data is shared with; and objection to processing based on legitimate interest. Requests can be sent to ${COMMUNITY_CONTACT.email} and will be answered within the legal deadlines.`,
      'You may also file a complaint with the Brazilian National Data Protection Authority (ANPD).',
    ],
  },
  {
    id: 'imagem',
    title: '9. Use of image and voice',
    paragraphs: [
      "Comunidade Viva's services, celebrations and events are photographed, filmed, recorded and streamed live online, and these recordings are published on Comunidade Viva's website and social media (such as YouTube, Instagram and Facebook) and in its institutional materials.",
      'By accepting these terms and remaining on the premises during these activities, you acknowledge that your image and voice may be captured, including incidentally, and you authorize, free of charge, their use by Comunidade Viva in broadcasts, recordings, photos and videos intended to publicize its religious, community and institutional activities, with no commercial purpose and no limitation of time or territory, in accordance with article 5, X, of the Brazilian Federal Constitution and article 20 of the Brazilian Civil Code.',
      'If you prefer not to be photographed or filmed, let the media team or the front desk know so they can guide you to areas less exposed to the cameras. You can also request, at the email above, the removal of a specific publication in which you appear prominently; your request will be reviewed and granted whenever possible. Recordings of live broadcasts already made and third-party recordings may not be removable.',
    ],
  },
  {
    id: 'menores',
    title: '10. Children and teenagers',
    paragraphs: [
      'Children and teenagers must use the network with the consent and under the supervision of their parents or legal guardians, who are responsible for its use and for the information provided, in accordance with article 14 of the LGPD and the Brazilian Statute of Children and Adolescents.',
    ],
  },
  {
    id: 'alteracoes',
    title: '11. Changes and general provisions',
    paragraphs: [
      'These terms may be updated at any time. The current version will always be available on this page and will be presented for new acceptance when necessary.',
      'These terms are governed by the laws of the Federative Republic of Brazil. The courts of Campo Grande/MS are chosen to settle any disputes, unless otherwise provided by law.',
    ],
  },
];
