import {ColumnVO } from '@ag-grid-community/all-modules'

export interface OdataQueryOptions{
    sort? : Array<string>;
    filter? : Array<string>;
    expand? : Array<string>;
} 
export interface OdataQueryExtendOptions extends OdataQueryOptions{
    skip? : number;
    top? : number;
}

export interface OdataQueryExtendFull extends OdataQueryExtendOptions{
    count? : boolean;
    apply? : Array<string>;
}

export declare class PivotResultDat{
    data: any[]
    aggCols: any[]
    secondaryColDefs:ColumnVO[]
}