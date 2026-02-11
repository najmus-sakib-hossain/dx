#!/bin/bash

# Move structs
for file in gpui_docs/structs/*.md; do
    mv "$file" "gpui_docs_clean/api/structs/$(basename "$file")"
done

# Move enums
for file in gpui_docs/enums/*.md; do
    mv "$file" "gpui_docs_clean/api/enums/$(basename "$file")"
done

# Move traits
for file in gpui_docs/traits/*.md; do
    mv "$file" "gpui_docs_clean/api/traits/$(basename "$file")"
done

# Move functions
for file in gpui_docs/fns/*.md; do
    mv "$file" "gpui_docs_clean/api/functions/$(basename "$file")"
done

# Move macros
for file in gpui_docs/macros/*.md; do
    mv "$file" "gpui_docs_clean/api/macros/$(basename "$file")"
done

# Move types
for file in gpui_docs/types/*.md; do
    mv "$file" "gpui_docs_clean/api/types/$(basename "$file")"
done

# Move constants
for file in gpui_docs/constants/*.md; do
    mv "$file" "gpui_docs_clean/api/constants/$(basename "$file")"
done

# Move derive macros
for file in gpui_docs/derives/*.md; do
    mv "$file" "gpui_docs_clean/api/derive_macros/$(basename "$file")"
done

# Move modules
mv gpui_docs/colors/indexs/*.md gpui_docs_clean/modules/colors.md
mv gpui_docs/_ownership_and_data_flow/indexs/*.md gpui_docs_clean/modules/ownership_and_data_flow.md

# Move crates (main)
mv gpui_docs/crates/*.md gpui_docs_clean/core/

# Move attributes
mv gpui_docs/attrs/*.md gpui_docs_clean/attributes/

# Move alls
mv gpui_docs/alls/*.md gpui_docs_clean/all/

# Move unknowns
mv gpui_docs/unknowns/*.md gpui_docs_clean/unknown/

# Move s (if any)
if [ -d gpui_docs/s ]; then
    mv gpui_docs/s/*.md gpui_docs_clean/unknown/
fi

echo "Reorganization complete."