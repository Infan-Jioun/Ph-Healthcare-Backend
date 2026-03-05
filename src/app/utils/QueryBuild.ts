import { IQueryConfig, IQueryParams, PrismaCountAegs, PrismaFindManyAegs, PrismaModelDelegets, PrismaNumberFilter, PrismaStringFilter, PrismaWhereConditions } from "../interface/query.interface"
export class QueryBuilder<T,
    TWhereInput = Record<string, unknown>,
    TInclude = Record<string, unknown>> {
    private query: PrismaFindManyAegs;
    private countQuery: PrismaCountAegs;
    private page: number = 1;
    private limit: number = 10;
    private skip: number = 0;
    private sortBy: string = "createdAt";
    private sortOrder: "asc" | "desc" = "desc";
    private selectFields: Record<string, boolean | undefined>

    constructor(
        private model: PrismaModelDelegets,
        private queryParams: IQueryParams,
        private config: IQueryConfig
    ) {
        this.query = {
            where: {},
            include: {},
            orderBy: {},
            skip: 0,
            take: 10
        };
        this.countQuery = {
            where: {}
        }

    }
    search(): this {
        const { searchItem } = this.queryParams;
        const { searchAbleFields } = this.config;
        if (searchItem && searchAbleFields && searchAbleFields.length > 0) {
            const searchConditions: Record<string, unknown>[] = searchAbleFields.map((field) => {
                if (field.includes(".")) {
                    const parts = field.split(".");
                    if (parts.length === 2) {
                        const [relations, nestedField] = parts;
                        const stringFilter = {
                            contains: searchItem,
                            node: "insensitive" as const
                        }
                        return {
                            [relations]: {
                                [nestedField]: stringFilter
                            }
                        }
                    } else if (parts.length === 3) {
                        const [relations, nestedRelations, nestedField] = parts;
                        const stringFilter: PrismaStringFilter = {
                            contains: searchItem,
                            node: "insensitive" as const
                        }
                        return {
                            [relations]: {
                                [nestedRelations]: {
                                    [nestedField]: stringFilter
                                }
                            }
                        }
                    }
                }
                //! Direct fields 
                const stringFilter: PrismaStringFilter = {
                    contains: searchItem,
                    node: "insensitive" as const
                }
                return {
                    [field]: stringFilter
                }

            })
            //! Where Conditions 
            const whereConditions = this.query.where as PrismaWhereConditions
            whereConditions.OR = searchConditions;
            const countWhereConditions = this.countQuery.where as PrismaWhereConditions;
            countWhereConditions.OR = searchConditions;
        }
        return this;
    }
    filter(): this {
        const { filterAbleFields } = this.config;
        const exCludedField = ["searchItem", "page", "limit", "sortBy", "sortOrder", "fields", "includes"];
        const filterParams: Record<string, unknown> = {};
        Object.keys(this.queryParams).forEach((key) => {
            if (!exCludedField.includes(key)) {
                filterParams[key] = this.queryParams[key]
            }
        })
        const queryWhere = this.query.where as Record<string, unknown>;
        const countQueryWhere = this.countQuery.where as Record<string, unknown>;
        Object.keys(filterParams).forEach((key) => {
            const value = filterParams[key];
            if (value === "undefined" || value === "") {
                return;
            }
            const isAllowedField = !filterAbleFields || filterAbleFields.length === 0 || filterAbleFields.includes(key);
            if (!isAllowedField) {
                return;
            }
            if (key.includes(".")) {
                const parts = key.split(".");
                if (filterAbleFields && !filterAbleFields.includes(key)) {
                    return;
                }
                if (parts.length === 2) {
                    const [relations, nestedField] = parts;
                    if (!queryWhere[relations]) {
                        queryWhere[relations] = {};
                        countQueryWhere[relations] = {}
                    }
                    queryWhere[relations] = {
                        [nestedField]: this.parseFilterValue(value)
                    }
                    countQueryWhere[relations] = {
                        [nestedField]: this.parseFilterValue(value)
                    }
                    return;
                } else if (parts.length === 3) {
                    const [relations, nestedRelations, nestedField] = parts;
                    if (!queryWhere[relations]) {
                        queryWhere[relations] = {};
                        countQueryWhere[relations] = {}
                    }
                    queryWhere[relations] = {
                        [nestedRelations]: {
                            [nestedField]: this.parseFilterValue(value)
                        }
                    }
                    countQueryWhere[relations] = {
                        [nestedField]: {
                            [nestedField]: this.parseFilterValue(value)
                        }
                    }
                }
                return;
            } else {
                queryWhere[key] = this.parseFilterValue(value);
                countQueryWhere[key] = this.parseFilterValue(value);
                return;
            }
            if (typeof value === "object" && value !== null && !Array.isArray(value)) {
                queryWhere[key] = this.parsedRangeFilter(value as Record<string, string | number>);;
                countQueryWhere[key] = this.parsedRangeFilter(value as Record<string, string | number>);
                return;
            }
            // direct 
            queryWhere[key] = this.parseFilterValue(value);
            countQueryWhere[key] = this.parseFilterValue(value);
        })
        return this;
    }
    paginate(): this {
        const page = Number(this.queryParams.page) || 1;
        const limit = Number(this.queryParams.limit) || 10;
        this.page = page;
        this.limit = limit;
        this.skip = (page - 1) * limit
        return this;
    }
    sort(): this {
        const sortBy = this.queryParams.sortBy || "createdAt";
        const sortOrder = this.queryParams.fields === "asc" ? "asc" : "desc";
        this.sortBy = sortBy;
        this.sortOrder = sortOrder;
        if (sortBy.includes(".")) {
            const parts = sortBy.split(".");
            if (parts.length === 2) {
                const [relations, nestedField] = parts;
                this.query.orderBy = {
                    [relations]: {
                        [nestedField]: sortOrder
                    }
                }

            } else if (parts.length === 3) {
                const [relations, nestedRelations, nestedField] = parts;
                this.query.orderBy = {
                    [relations]: {
                        [nestedRelations]: {
                            [nestedField]: sortOrder
                        }
                    }
                }
            } else {
                this.query.orderBy = {
                    [sortBy]: sortOrder
                }
            }
        }
        return this;

    }

    private parseFilterValue(value: unknown): unknown {
        if (value === "true") {
            return true;
        }
        if (value === "false") {
            return false;
        }
        if (typeof value === "string" && !isNaN(Number(value)) && value != "") {
            return Number(value);
        }
        if (Array.isArray(value)) {
            return { in: value.map((item) => this.parseFilterValue(item)) }
        }
        return value
    }
    private parsedRangeFilter(value: Record<string, string | number>):
        PrismaNumberFilter | PrismaStringFilter | Record<string, string | unknown> {
        const rangeQuery: Record<string, string | number | (string | number)[]> = {};
        Object.keys(value).forEach((operator) => {
            const operatorValue = value[operator];
            const parsedValue: string | number = typeof operatorValue === "string" && !isNaN(Number(operatorValue)) ? Number(operatorValue) : operatorValue;
            switch (operator) {
                case "lt":
                case "lte":
                case "gt":
                case "gte":
                case "equals":
                case "not":
                case "contains":
                case "startsWith":
                case "endsWith":
                    rangeQuery[operator] = parsedValue;
                    break;
                case "in":
                case "notIn":
                    if (Array.isArray(operatorValue)) {
                        rangeQuery[operator] = operatorValue;
                    } else {
                        rangeQuery[operator] = [parsedValue];
                    }
                    break;
                default: break;

            }
        });
        return Object.keys(rangeQuery).length > 0 ? rangeQuery : value;

    }

}