declare namespace NodeJS {
  interface ProcessEnv {
    readonly SERVER_URL: string;
  }
}

declare module '*.png' {
  const src: string;
  export default src;
}