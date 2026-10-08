export type CommunityAddress = {
  street: string;
  district: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type CommunityPhone = {
  display: string;
  e164: string;
};

export type CommunitySocialNetworks = {
  instagram: string;
  facebook: string;
  youtube: string;
};

export type CommunityContact = {
  address: CommunityAddress;
  phone: CommunityPhone;
  email: string;
  socialNetworks: CommunitySocialNetworks;
};

// Canais definidos pela liderança. Devem migrar para a API quando ela existir.
export const COMMUNITY_CONTACT: CommunityContact = {
  address: {
    street: 'Av. Roseiras, 1684',
    district: 'Parque Residencial Girassóis',
    city: 'Campo Grande',
    state: 'MS',
    postalCode: '79090-070',
    country: 'Brasil',
  },
  phone: {
    display: '+55 (67) 9 9106-6631',
    e164: '+5567991066631',
  },
  email: 'comunidadevivaoficial@gmail.com',
  socialNetworks: {
    instagram: 'https://www.instagram.com/comunidadevivacg/',
    facebook: 'https://www.facebook.com/comunidadevivacg?locale=pt_BR',
    youtube: 'https://www.youtube.com/channel/UCZDp3avJp6YEUe7vhKhBLWA',
  },
};
