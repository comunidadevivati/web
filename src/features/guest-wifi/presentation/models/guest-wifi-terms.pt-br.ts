import { COMMUNITY_CONTACT } from '@/features/contact/domain/community-contact';
import type { GuestWifiTermsSection } from '@/features/guest-wifi/presentation/models/guest-wifi-terms.model';

// Texto oficial dos termos (versão que prevalece).
export const guestWifiTermsPtBR: GuestWifiTermsSection[] = [
  {
    id: 'objeto',
    title: '1. Sobre estes termos',
    paragraphs: [
      'Estes Termos de Uso e Política de Privacidade regulam o acesso à rede Wi-Fi "VIVA - Visitantes", oferecida gratuitamente pela Comunidade Viva, por cortesia, a visitantes e frequentadores durante a permanência em suas dependências.',
      'Ao marcar a opção de aceite e prosseguir, você declara que leu, compreendeu e concorda com todas as condições abaixo. Se não concordar, não utilize a rede.',
    ],
  },
  {
    id: 'uso',
    title: '2. Condições de uso da rede',
    paragraphs: [
      'A rede deve ser utilizada de forma ética, responsável e de acordo com a legislação brasileira e com os valores da Comunidade Viva. É proibido utilizá-la para:',
    ],
    items: [
      'acessar, armazenar ou divulgar conteúdo ilegal, pornográfico, violento, discriminatório ou que incite ódio;',
      'baixar ou compartilhar conteúdo protegido por direitos autorais sem autorização (pirataria);',
      'praticar ou tentar praticar invasões, ataques, varreduras, interceptação de dados ou qualquer ação que comprometa a segurança da rede ou de terceiros;',
      'enviar spam, golpes, mensagens fraudulentas ou praticar qualquer crime ou ato ilícito;',
      'consumir de forma abusiva a banda disponível, prejudicando os demais usuários.',
    ],
  },
  {
    id: 'servico',
    title: '3. Características do serviço',
    paragraphs: [
      'O acesso é gratuito, pessoal e temporário, podendo ser limitado em tempo, velocidade ou volume de dados. A Comunidade Viva pode bloquear sites e serviços, encerrar conexões e suspender o acesso de quem descumprir estes termos, a qualquer momento e sem aviso prévio.',
      'O serviço é oferecido "no estado em que se encontra", sem garantia de disponibilidade, velocidade ou continuidade. Por se tratar de uma rede compartilhada, recomendamos não transmitir informações sensíveis sem conexão segura (HTTPS) e manter seu dispositivo protegido e atualizado.',
    ],
  },
  {
    id: 'responsabilidade',
    title: '4. Responsabilidades',
    paragraphs: [
      'Você é o único responsável pelo uso que fizer da rede, pelos conteúdos que acessar ou transmitir e pela segurança do seu dispositivo. A Comunidade Viva não se responsabiliza por danos, perdas de dados, vírus ou prejuízos decorrentes do uso da rede, nem por conteúdos de terceiros acessados por meio dela.',
      'Em caso de uso indevido, os registros de conexão poderão ser fornecidos às autoridades competentes, mediante requisição legal ou ordem judicial, nos termos do Marco Civil da Internet (Lei nº 12.965/2014).',
    ],
  },
  {
    id: 'dados',
    title: '5. Dados pessoais coletados',
    paragraphs: [
      'Em conformidade com a Lei Geral de Proteção de Dados Pessoais (LGPD, Lei nº 13.709/2018), a Comunidade Viva, como controladora, coleta apenas os dados necessários para oferecer o acesso:',
    ],
    items: [
      'dados informados por você: nome completo e telefone;',
      'dados técnicos da conexão: endereço MAC e endereço IP do dispositivo, rede e equipamento utilizados, data, horário e duração do acesso;',
      'registro do seu aceite a estes termos, com data, horário e versão do texto.',
    ],
  },
  {
    id: 'finalidades',
    title: '6. Para que usamos seus dados',
    paragraphs: ['Seus dados são tratados exclusivamente para:'],
    items: [
      'identificar o usuário e liberar o acesso à internet (execução do serviço solicitado por você);',
      'manter a segurança da rede, prevenir fraudes e apurar usos indevidos (legítimo interesse);',
      'guardar os registros de conexão pelo prazo exigido em lei e atender a requisições de autoridades (cumprimento de obrigação legal);',
      'eventualmente entrar em contato para agradecer sua visita e compartilhar informações sobre a Comunidade Viva (legítimo interesse). Você pode pedir para não ser mais contatado a qualquer momento.',
    ],
  },
  {
    id: 'compartilhamento',
    title: '7. Compartilhamento e armazenamento',
    paragraphs: [
      'A Comunidade Viva não vende, aluga ou cede seus dados pessoais. Eles podem ser tratados por fornecedores de tecnologia que operam a rede e o sistema (como equipamentos e serviços de nuvem), sempre limitados às finalidades acima, e compartilhados com autoridades públicas apenas quando houver obrigação legal ou ordem judicial.',
      'Os registros de conexão são mantidos, em sigilo e em ambiente controlado, pelo prazo mínimo exigido em lei. Os demais dados são mantidos pelo tempo necessário às finalidades informadas, por no máximo 2 (dois) anos após o seu último acesso, e depois são eliminados ou anonimizados, salvo obrigação legal de guarda.',
      'Adotamos medidas técnicas e administrativas razoáveis para proteger seus dados contra acessos não autorizados, perda ou uso indevido.',
    ],
  },
  {
    id: 'direitos',
    title: '8. Seus direitos como titular',
    paragraphs: [
      `Nos termos do art. 18 da LGPD, você pode, a qualquer momento e gratuitamente, solicitar: a confirmação da existência de tratamento; o acesso aos seus dados; a correção de dados incompletos, inexatos ou desatualizados; a anonimização, o bloqueio ou a eliminação de dados desnecessários ou tratados em desconformidade com a lei; a portabilidade; informações sobre com quem seus dados são compartilhados; e a oposição a tratamentos realizados com base no legítimo interesse. As solicitações podem ser feitas pelo e-mail ${COMMUNITY_CONTACT.email} e serão respondidas nos prazos legais.`,
      'Você também pode apresentar reclamação à Autoridade Nacional de Proteção de Dados (ANPD).',
    ],
  },
  {
    id: 'imagem',
    title: '9. Uso de imagem e voz',
    paragraphs: [
      'Os cultos, celebrações e eventos da Comunidade Viva são fotografados, filmados, gravados e transmitidos ao vivo pela internet, e esses registros são publicados no site e nas redes sociais da Comunidade Viva (como YouTube, Instagram e Facebook) e em seus materiais institucionais.',
      'Ao aceitar estes termos e permanecer nas dependências durante essas atividades, você declara estar ciente de que sua imagem e sua voz poderão ser captadas, inclusive de forma incidental, e autoriza, de forma gratuita, o seu uso pela Comunidade Viva em transmissões, gravações, fotos e vídeos destinados à divulgação de suas atividades religiosas, comunitárias e institucionais, sem finalidade comercial, sem limitação de tempo ou território, conforme o art. 5º, X, da Constituição Federal e o art. 20 do Código Civil.',
      'Se preferir não ser fotografado ou filmado, informe a equipe de mídia ou a recepção para ser orientado sobre os locais menos expostos às câmeras. Você também pode solicitar, pelo e-mail informado acima, a remoção de uma publicação específica em que apareça de forma destacada, que será analisada e atendida sempre que possível. Registros de transmissões ao vivo já realizadas e de terceiros podem não ser passíveis de remoção.',
    ],
  },
  {
    id: 'menores',
    title: '10. Crianças e adolescentes',
    paragraphs: [
      'Crianças e adolescentes devem utilizar a rede com o consentimento e sob a supervisão de seus pais ou responsáveis legais, que se responsabilizam pelo uso e pelas informações fornecidas, em conformidade com o art. 14 da LGPD e com o Estatuto da Criança e do Adolescente.',
    ],
  },
  {
    id: 'alteracoes',
    title: '11. Alterações e disposições gerais',
    paragraphs: [
      'Estes termos podem ser atualizados a qualquer momento. A versão vigente estará sempre disponível nesta página e será apresentada para um novo aceite quando necessário.',
      'Estes termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da comarca de Campo Grande/MS para resolver eventuais questões, salvo disposição legal em contrário.',
    ],
  },
];
