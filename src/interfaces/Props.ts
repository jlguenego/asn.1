export interface Props {
  [key: string]: PropsItem;
}

export type PropsItem = string | number | boolean | Props | undefined | Props[];
