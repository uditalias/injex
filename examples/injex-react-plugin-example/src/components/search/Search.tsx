import * as React from "react";
import theme from "./theme.scss";

export default function Search({ onFilter, placeholder }: { onFilter: (value: string) => void; placeholder: string }): JSX.Element {
    const onFilterChange = React.useCallback((e) => onFilter(e.target.value), []);

    return (
        <div className={theme.search}>
            <input placeholder={placeholder} onChange={onFilterChange} />
        </div>
    );
}