module.exports = (mongoose) => {
    const Collection = mongoose.model(
        "Collection",
        mongoose.Schema(
            {
                name: String,
                image: String,
                description: String,
                author: String,
            },
            { timestamps: true }
        )
    );

    return Collection;
};
