"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QueryBuilder {
    constructor(modelQuery, query) {
        this.modelQuery = modelQuery;
        this.query = query;
    }
    search(searchableFields) {
        const search = this.query.search;
        if (typeof search === 'string' && search.trim().length > 0) {
            this.modelQuery = this.modelQuery.find({
                $or: searchableFields.map((field) => ({
                    [field]: { $regex: search, $options: 'i' },
                })),
            });
        }
        return this;
    }
    filter() {
        // Copy query object to manipulate
        const queryObj = Object.assign({}, this.query);
        // Fields to exclude from filtering
        const excludeFields = ['search', 'sort', 'sortBy', 'limit', 'page', 'fields', 'availability'];
        excludeFields.forEach((field) => delete queryObj[field]);
        // Price range filtering
        if (queryObj.minPrice !== undefined || queryObj.maxPrice !== undefined) {
            const priceFilter = {};
            if (queryObj.minPrice !== undefined) {
                priceFilter['$gte'] = Number(queryObj.minPrice);
                delete queryObj.minPrice;
            }
            if (queryObj.maxPrice !== undefined) {
                priceFilter['$lte'] = Number(queryObj.maxPrice);
                delete queryObj.maxPrice;
            }
            if (Object.keys(priceFilter).length > 0) {
                queryObj['price'] = priceFilter;
            }
        }
        // Availability filtering
        const availability = this.query.availability;
        if (availability === 'in-stock') {
            queryObj['stock_quantity'] = { $gt: 0 };
        }
        else if (availability === 'out-of-stock') {
            queryObj['stock_quantity'] = 0;
        }
        // Apply the final filter query
        this.modelQuery = this.modelQuery.find(queryObj);
        return this;
    }
    sort() {
        let sortStr = '-createdAt'; // default sort
        if (typeof this.query.sortBy === 'string' && this.query.sortBy.trim() !== '') {
            switch (this.query.sortBy) {
                case 'price-asc':
                    sortStr = 'price';
                    break;
                case 'price-desc':
                    sortStr = '-price';
                    break;
                default:
                    sortStr = this.query.sortBy.split(',').join(' ');
                    break;
            }
        }
        else if (typeof this.query.sort === 'string' && this.query.sort.trim() !== '') {
            sortStr = this.query.sort.split(',').join(' ');
        }
        this.modelQuery = this.modelQuery.sort(sortStr);
        return this;
    }
    paginate() {
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;
        const skip = (page - 1) * limit;
        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }
    fields() {
        const fields = typeof this.query.fields === 'string'
            ? this.query.fields.split(',').join(' ')
            : '-__v';
        this.modelQuery = this.modelQuery.select(fields);
        return this;
    }
    /**
     * Count total documents for current filters and calculate pagination metadata.
     */
    async countTotal() {
        const filter = this.modelQuery.getFilter();
        const total = await this.modelQuery.model.countDocuments(filter);
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;
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
