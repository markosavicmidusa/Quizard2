
export interface ICategory{
    label:string;
    link:string;
    picturePath:string;
}

export const categories: ICategory[] = [
    { label: "SPORTS", link: "/sports", picturePath: "sports.svg" },
    { label: "POPULAR", link: "/popular", picturePath: "popular.svg" },
    { label: "FUN", link: "/fun", picturePath: "fun.svg" },
    { label: "SCIENCE", link: "/science", picturePath: "science.svg" },
    { label: "OTHER", link: "/other", picturePath: "other.svg" }
  ];