import * as React from "react";
import {
    DetailsList,
    DetailsListLayoutMode,
    Selection,
    SelectionMode,
    IColumn,
} from "@fluentui/react/lib/DetailsList";
import { Icon } from "@fluentui/react";
import { mergeStyleSets } from "@fluentui/react/lib/Styling";
import sampleData from "../util/data.json";
const seedrandom = require("seedrandom");

const classNames = mergeStyleSets({
    fileIconHeaderIcon: {
        padding: 0,
        fontSize: "16px",
    },
    fileIconCell: {
        textAlign: "center",
        selectors: {
            "&:before": {
                content: ".",
                display: "inline-block",
                verticalAlign: "middle",
                height: "100%",
                width: "0px",
                visibility: "hidden",
            },
        },
    },
    fileIconImg: {
        verticalAlign: "middle",
        maxHeight: "16px",
        maxWidth: "16px",
    },
    controlWrapper: {
        display: "flex",
        flexWrap: "wrap",
    },
    exampleToggle: {
        display: "inline-block",
        marginBottom: "10px",
        marginRight: "30px",
    },
    selectionDetails: {
        marginBottom: "20px",
    },
});
const controlStyles = {
    root: {
        margin: "0 30px 20px 0",
        maxWidth: "300px",
    },
};

export interface IDetailsListDocumentsExampleState {
    columns: IColumn[];
    items: IDocument[];
    serialFilter: string;
    partsFilter: string[];
    selectionDetails: string;
    isModalSelection: boolean;
    isCompactMode: boolean;
    announcedMessage?: string;
}

export interface IDocument {
    key: string;
    name: string;
    value: string;
    serialNumber: number;
    category: string;
    categoryValue: string;
    stock: number;
    location: string;
    price: number;
}

class Database extends React.Component<
    { serialFilter; partsFilter },
    IDetailsListDocumentsExampleState
> {
    private _selection: Selection;
    private _allItems: IDocument[];
    rng = seedrandom("Azure"); // seeded rng, must be placed within component to ensure same results on update

    constructor(props: { serialFilter; partsFilter }) {
        super(props);

        this._allItems = this._generateDocuments();

        const columns: IColumn[] = [
            {
                key: "column1",
                name: "File Type",
                className: classNames.fileIconCell,
                iconClassName: classNames.fileIconHeaderIcon,
                ariaLabel:
                    "Column operations for File type, Press to sort on File type",
                iconName: "ProductList",
                isIconOnly: true,
                fieldName: "stock",
                minWidth: 16,
                maxWidth: 16,
                onColumnClick: this._onColumnClick,
                // < 10 items: low stock, >= 75 items: popular item
                onRender: (item: IDocument) => {
                    if (item.stock < 10) {
                        return (
                            <Icon
                                iconName="HourGlass"
                                styles={{ root: { color: "#0078d4" } }}
                            />
                        );
                    } else if (item.stock >= 75) {
                        return (
                            <Icon
                                iconName="FlameSolid"
                                styles={{ root: { color: "#d83b01" } }}
                            />
                        );
                    }
                    return null;
                },
            },
            {
                key: "column2",
                name: "Serial Number",
                fieldName: "serialNumber",
                minWidth: 100,
                maxWidth: 350,
                isRowHeader: true,
                isResizable: true,
                isSorted: true,
                isSortedDescending: false,
                sortAscendingAriaLabel: "Sorted A to Z",
                sortDescendingAriaLabel: "Sorted Z to A",
                onColumnClick: this._onColumnClick,
                data: "string",
                isPadded: true,
            },
            {
                key: "column3",
                name: "Category",
                fieldName: "category",
                minWidth: 160,
                maxWidth: 200,
                isRowHeader: true,
                isResizable: true,
                isSorted: true,
                isSortedDescending: false,
                sortAscendingAriaLabel: "Sorted A to Z",
                sortDescendingAriaLabel: "Sorted Z to A",
                onColumnClick: this._onColumnClick,
                data: "string",
                isPadded: true,
            },
            {
                key: "column4",
                name: "Name",
                fieldName: "name",
                minWidth: 210,
                maxWidth: 350,
                isRowHeader: true,
                isResizable: true,
                isSorted: true,
                isSortedDescending: false,
                sortAscendingAriaLabel: "Sorted A to Z",
                sortDescendingAriaLabel: "Sorted Z to A",
                onColumnClick: this._onColumnClick,
                data: "string",
                isPadded: true,
            },
            {
                key: "column5",
                name: "Location",
                fieldName: "location",
                minWidth: 160,
                isResizable: true,
                onColumnClick: this._onColumnClick,
                data: "number",
                onRender: (item: IDocument) => {
                    return <span>{item.location}</span>;
                },
                isPadded: true,
            },
            {
                key: "column6",
                name: "Stock",
                fieldName: "stock",
                minWidth: 70,
                maxWidth: 90,
                isResizable: true,
                isCollapsible: true,
                data: "string",
                onColumnClick: this._onColumnClick,
                onRender: (item: IDocument) => {
                    return <span>{item.stock > 50 ? "50+" : item.stock}</span>;
                },
                isPadded: true,
            },
            {
                key: "column7",
                name: "Price",
                fieldName: "price",
                minWidth: 70,
                maxWidth: 90,
                isResizable: true,
                isCollapsible: true,
                data: "number",
                onColumnClick: this._onColumnClick,
                onRender: (item: IDocument) => {
                    return <span>${item.price}</span>;
                },
            },
        ];

        this._selection = new Selection({
            onSelectionChanged: () => {
                this.setState({
                    selectionDetails: this._getSelectionDetails(),
                });
            },
        });
        this.state = {
            items: this._allItems,
            serialFilter: props.serialFilter,
            partsFilter: props.partsFilter,
            columns: columns,
            selectionDetails: this._getSelectionDetails(),
            isModalSelection: false,
            isCompactMode: false,
            announcedMessage: undefined,
        };
    }

    public render() {
        const { columns, isCompactMode, items, serialFilter, partsFilter } =
            this.state;
        // filter items before displaying
        // ignore filter if both filters are empty
        const filtered_items = items.filter((item) => {
            return (
                (serialFilter === "" && partsFilter.length === 0) ||
                item.serialNumber.toString() === serialFilter ||
                partsFilter.includes(item.categoryValue)
            );
        });
        return (
            <div>
                <DetailsList
                    items={filtered_items}
                    compact={isCompactMode}
                    columns={columns}
                    selectionMode={SelectionMode.none}
                    getKey={this._getKey}
                    setKey="none"
                    layoutMode={DetailsListLayoutMode.justified}
                    isHeaderVisible={true}
                    onItemInvoked={this._onItemInvoked}
                />
            </div>
        );
    }

    public componentDidUpdate(
        previousProps: any,
        previousState: IDetailsListDocumentsExampleState
    ) {
        // update on filter change
        if (
            previousProps.serialFilter !== this.props.serialFilter ||
            previousProps.partsFilter !== this.props.partsFilter
        ) {
            this.setState({
                serialFilter: this.props.serialFilter,
                partsFilter: this.props.partsFilter,
            });
        }
    }

    private _getKey(item: any, index?: number): string {
        return item.key;
    }

    private _onChangeCompactMode = (
        ev: React.MouseEvent<HTMLElement>,
        checked: boolean
    ): void => {
        this.setState({ isCompactMode: checked });
    };

    private _onChangeModalSelection = (
        ev: React.MouseEvent<HTMLElement>,
        checked: boolean
    ): void => {
        this.setState({ isModalSelection: checked });
    };

    private _onChangeText = (
        ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
        text: string
    ): void => {
        this.setState({
            items: text
                ? this._allItems.filter(
                      (i) => i.name.toLowerCase().indexOf(text) > -1
                  )
                : this._allItems,
        });
    };

    private _onItemInvoked(item: any): void {
        alert(`Item invoked: ${item.name}`);
    }

    private _getSelectionDetails(): string {
        const selectionCount = this._selection.getSelectedCount();

        switch (selectionCount) {
            case 0:
                return "No items selected";
            case 1:
                return (
                    "1 item selected: " +
                    (this._selection.getSelection()[0] as IDocument).name
                );
            default:
                return `${selectionCount} items selected`;
        }
    }

    private _onColumnClick = (
        ev: React.MouseEvent<HTMLElement>,
        column: IColumn
    ): void => {
        const { columns, items } = this.state;
        const newColumns: IColumn[] = columns.slice();
        const currColumn: IColumn = newColumns.filter(
            (currCol) => column.key === currCol.key
        )[0];
        newColumns.forEach((newCol: IColumn) => {
            if (newCol === currColumn) {
                currColumn.isSortedDescending = !currColumn.isSortedDescending;
                currColumn.isSorted = true;
                this.setState({
                    announcedMessage: `${currColumn.name} is sorted ${
                        currColumn.isSortedDescending
                            ? "descending"
                            : "ascending"
                    }`,
                });
            } else {
                newCol.isSorted = false;
                newCol.isSortedDescending = true;
            }
        });
        const newItems = _copyAndSort(
            items,
            currColumn.fieldName!,
            currColumn.isSortedDescending
        );
        this.setState({
            columns: newColumns,
            items: newItems,
        });
    };
    _generateDocuments() {
        // seat, frame, handlebar, pedal, wheel
        const categoryMap = {
            Saddles: "seat",
            Handlebars: "handlebar",
            "Road Frames": "frame",
            Wheels: "wheel",
            Pedals: "pedal",
        };
        const items: IDocument[] = [];
        for (let i = 0; i < sampleData.length; i++) {
            const randomStock = this._randomNumber(0, 100);
            const randomSerialNumber = this._randomNumber(100000, 999999);
            const randomLocation = this._randomLocation();
            items.push({
                key: i.toString(),
                name: sampleData[i].ProductName,
                value: sampleData[i].ProductName,
                category: sampleData[i].CategoryName,
                categoryValue: categoryMap[sampleData[i].CategoryName],
                serialNumber: randomSerialNumber,
                stock: randomStock,
                location: randomLocation,
                price: parseFloat(sampleData[i].Price),
            });
        }
        return items;
    }

    _randomDate(
        start: Date,
        end: Date
    ): { value: number; dateFormatted: string } {
        const date: Date = new Date(
            start.getTime() + this.rng() * (end.getTime() - start.getTime())
        );
        return {
            value: date.valueOf(),
            dateFormatted: date.toLocaleDateString(),
        };
    }

    _randomLocation(): string {
        const locations = [
            "Tokyo, Japan",
            "Seattle, US",
            "Chicago, US",
            "Barcelona, Spain",
            "Paris, France",
            "Amsterdam, Netherlands",
        ];
        return locations[Math.floor(this.rng() * locations.length)];
    }

    _randomNumber(lower: number, upper: number): number {
        return Math.floor(this.rng() * (upper - lower)) + lower;
    }
}

function _copyAndSort<T>(
    items: T[],
    columnKey: string,
    isSortedDescending?: boolean
): T[] {
    const key = columnKey as keyof T;
    return items
        .slice(0)
        .sort((a: T, b: T) =>
            (isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1
        );
}

export default Database;
