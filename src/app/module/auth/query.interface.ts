export interface PrismaFindManyAegs {
    where?: Record<string, unknown>;
    innclude?: Record<string, unknown>;
    select?: Record<string, boolean | Record<string, unknown>>;
    orderBy?: Record<string, unknown> | Record<string, unknown>;
    skip?: number,
    take?: number,
    cursor?: Record<string, unknown>;
    distinct?: string[] | string;
    [key: string]: unknown;

}