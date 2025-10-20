import React, { FC, useState, useEffect } from "react";

interface ImultiSelectProps {
    disabled?: boolean;
    options: {
        label: string;
        id: string;
        value: string;
    }[];
    onChange: (selectedIds: string[]) => void;
    value: string[];
    setSelectedTable: (v: string[]) => void
}

export const MultiSelect: FC<ImultiSelectProps> = ({ options, disabled, onChange, value: v, setSelectedTable }) => {
    const [selectedValues, setSelectedValues] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const initialValues = options
            .filter(option => v?.includes(option.id))
            .map(option => option.value);
        setSelectedValues(initialValues);
    }, [v, options]);

    const handleToggleSelect = () => {
        if (disabled) {
            return;
        }
        setIsOpen(!isOpen);
    };

    const handleCheckboxChange = (value: string) => {
        let newSelectedValues;
        if (selectedValues.includes(value)) {
            newSelectedValues = selectedValues.filter((item) => item !== value);
        } else {
            newSelectedValues = [...selectedValues, value];
        }
        setSelectedValues(newSelectedValues);

        if (onChange) {
            const selectedIds = options
                .filter(option => newSelectedValues.includes(option.value))
                .map(option => option.id);
            onChange(selectedIds);

            setSelectedTable(selectedIds)
        }
    };

    const handleClickOutside = (e: React.MouseEvent) => {
        if (!(e.target as HTMLElement).closest(".multiselect")) {
            setIsOpen(false);
        }
    };

    return (
        <div className={`multiselect ${disabled ? 'selectDisabled' : ''}`} onClick={handleClickOutside}>
            <div
                onClick={handleToggleSelect}
                style={{
                    padding: "8px 16px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    cursor: "pointer",
                    width: '100%',
                    display: 'flex',
                    alignItems: "center",
                    justifyContent: 'space-between'
                }}
            >
                {selectedValues.length > 0
                    ? selectedValues
                        .map(value => {
                            const option = options.find(opt => opt.value === value);
                            return option ? option.label.split(' ').pop() : value;
                        })
                        .join(", ")
                    : "Выбрать"}
                {/* <img src="/arrow.png" alt="arrow down" /> */}
            </div>

            {isOpen && (
                <div
                    className="multiselect-overlay"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <div className={`multiselect-dropdown ${isOpen ? 'open' : ''}`}>
                {options.map((option) => (
                    <div
                        key={option.value}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "4px 0",
                            cursor: "pointer",
                        }}
                        onClick={() => handleCheckboxChange(option.value)}
                    >
                        <input
                            className="select-checkbox"
                            type="checkbox"
                            checked={selectedValues.includes(option.value)}
                            onChange={() => handleCheckboxChange(option.value)}
                            style={{ marginRight: "8px" }}
                        />
                        <label>{option.label}</label>
                    </div>
                ))}
            </div>
        </div>
    );
};