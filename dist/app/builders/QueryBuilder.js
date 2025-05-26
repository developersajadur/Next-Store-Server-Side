"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QueryBuilder {
    constructor(modelQuery, query) {
        this.modelQuery = modelQuery;
        this.query = query;
    }
    search(searchableFields) {
        var _a;
        const search = (_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.search;
        if (search) {
            this.modelQuery = this.modelQuery.find({
                $or: searchableFields.map((field) => ({
                    [field]: { $regex: search, $options: 'i' },
                })),
            });
        }
        return this;
    }
    filter() {
        const queryObj = Object.assign({}, this.query); // copy
        // Filtering
        const excludeFields = ['search', 'sort', 'limit', 'page', 'fields'];
        excludeFields.forEach((el) => delete queryObj[el]);
        // Handle minPrice and maxPrice filtering
        if (queryObj.minPrice || queryObj.maxPrice) {
            const priceQuery = {};
            if (queryObj.minPrice) {
                priceQuery['$gte'] = queryObj.minPrice; // minPrice filter
                delete queryObj.minPrice;
            }
            if (queryObj.maxPrice) {
                priceQuery['$lte'] = queryObj.maxPrice; // maxPrice filter
                delete queryObj.maxPrice;
            }
            // If price filter exists, add to the query
            if (Object.keys(priceQuery).length > 0) {
                queryObj['price'] = priceQuery;
            }
        }
        this.modelQuery = this.modelQuery.find(queryObj);
        return this;
    }
    sort() {
        var _a, _b, _c;
        const sort = ((_c = (_b = (_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.sort) === null || _b === void 0 ? void 0 : _b.split(',')) === null || _c === void 0 ? void 0 : _c.join(' ')) || '-createdAt';
        this.modelQuery = this.modelQuery.sort(sort);
        return this;
    }
    paginate() {
        var _a, _b;
        const page = Number((_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.page) || 1;
        const limit = Number((_b = this === null || this === void 0 ? void 0 : this.query) === null || _b === void 0 ? void 0 : _b.limit) || 10;
        const skip = (page - 1) * limit;
        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }
    fields() {
        var _a, _b, _c;
        const fields = ((_c = (_b = (_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.fields) === null || _b === void 0 ? void 0 : _b.split(',')) === null || _c === void 0 ? void 0 : _c.join(' ')) || '-__v';
        this.modelQuery = this.modelQuery.select(fields);
        return this;
    }
    async countTotal() {
        var _a, _b;
        const totalQueries = this.modelQuery.getFilter();
        const total = await this.modelQuery.model.countDocuments(totalQueries);
        const page = Number((_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.page) || 1;
        const limit = Number((_b = this === null || this === void 0 ? void 0 : this.query) === null || _b === void 0 ? void 0 : _b.limit) || 10;
        const totalPage = Math.ceil(total / limit);
        return {
            page,
            limit,
            total,
            totalPage,
        };
    }
}
exports.default = QueryBuilder;
