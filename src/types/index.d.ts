type ContentType = string;
type HttpStatus = number;

declare namespace robots {
  export interface Sitemap {
    value: string,
  }


  export interface Tuple {
    key: string,
    value: string
  }

  export type SitemapList = Sitemap[];
  export type TupleList = Tuple[];

}

declare namespace sitemap {
  export interface Url {
    loc: string
  }

  export interface Index {
    loc: string[]
  }

  export interface Urlset {
    url: Url[]
  }

  export interface ValidatedInfo {
    url: string,
    contentType: ContentType,
    status: HttpStatus,
    linkCount?: number
  }

  export type IndexList = Index[];

  export type report = {
    validDomain: boolean,
    reachable?: number
  }
}
