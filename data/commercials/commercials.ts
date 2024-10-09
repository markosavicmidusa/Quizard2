export interface Commercial{
    label: string;
    link:string;
    picturePath:string
}

export const commercials: Commercial[] = [
  { label: "DIADORA", link: "https://www.diadora.com/", picturePath: "diadora.jpg" },
  { label: "DRAGON-FURNITURE", link: "https://www.pinterest.com/dragonwishe/dragon-furniture/", picturePath: "dragon.jpg" },
  { label: "LANCER", link: "https://www.mitsubishicars.com/lancer-history", picturePath: "lancer.jpg" },
  { label: "PEPSI", link: "https://www.pepsi.com/", picturePath: "pepsi.jpg" },
  { label: "TRPKOVIC", link: "https://pekaratrpkovic.rs/", picturePath: "trpkovic.png" },
  { label: "NIKE", link: "https://www.nike.com/", picturePath: "nike.jpg" },
  { label: "REEBOK", link: "https://www.reebok.com/", picturePath: "reebok.jpg" },
  { label: "ROSA", link: "https://www.coca-cola.com/rs/sr/brands/rosa-vlasina", picturePath: "rosa.jpg" },
  { label: "SKECHERS", link: "https://www.skechers.com/", picturePath: "skechers.jpg" }
]