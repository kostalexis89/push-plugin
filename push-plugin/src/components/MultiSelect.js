import React, { useState, useEffect, useRef } from "react";

// Function to flatten data
function flattenData(data) {
  let result = [];

  function extractItems(items) {
    items.forEach((item) => {
      if (item.tags || item.groups) {
        if (item.tags) {
          item.tags.forEach((tag) => {
            if (!tag.tags && !tag.groups) {
              result.push(tag);
            } else {
              extractItems([tag]);
            }
          });
        }
        if (item.groups) {
          item.groups.forEach((group) => {
            if (!group.tags && !group.groups) {
              result.push(group);
            } else {
              extractItems([group]);
            }
          });
        }
      }
    });
  }

  extractItems(data);
  return result;
}

const MultiSelect = ({ data, selectedItems, setSelectedItems }) => {
  const [flattenedData, setFlattenedData] = useState([]);
  const [query, setQuery] = useState(""); // For filtering input
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // For showing/hiding the dropdown
  const dropdownRef = useRef(null); // Ref to the dropdown container
  const inputRef = useRef(null); // Ref to the input field

  console.log(selectedItems);

  useEffect(() => {
    setFlattenedData(flattenData(data));
  }, [data]);

  // Close dropdown if clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (item) => {
    // Toggle selection
    if (selectedItems.some((i) => i.id === item.id)) {
      // Deselect the item
      setSelectedItems(
        selectedItems.filter((selected) => selected.id !== item.id)
      );
    } else {
      // Select the item
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleRemoveItem = (itemToRemove) => {
    setSelectedItems(selectedItems.filter((item) => item !== itemToRemove));
  };

  const filteredData = query
    ? flattenedData.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      )
    : flattenedData; // If query is empty, show all items

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setIsDropdownOpen(true); // Keep dropdown open when user types
  };

  const handleInputFocus = () => {
    setIsDropdownOpen(true); // Open dropdown when input is focused
  };

  return (
    <div style={{ paddingBottom: "10px" }}>
      <label style={{ fontWeight: "bold", fontSize: "14px" }}>Push Tags</label>

      {/* Selected items display */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "5px",
          marginTop: "5px",
        }}
      >
        {selectedItems.map((item) => (
          <span
            key={item.id}
            style={{
              background: "#eee",
              padding: "5px 10px",
              borderRadius: "5px",
              display: "flex",
              alignItems: "center",
              fontSize: "14px",
            }}
          >
            {item.name}
            <button
              onClick={() => handleRemoveItem(item)}
              style={{
                marginLeft: "8px",
                cursor: "pointer",
                border: "none",
                fontWeight: "bold", // Makes the "X" thicker
                fontSize: "16px",
                background: "transparent",
              }}
            >
              &#10008;{" "}
            </button>
          </span>
        ))}
      </div>

      {/* Autocomplete MultiSelect */}
      <div style={{ position: "relative" }}>
        <input
          className="input-with-placeholder"
          ref={inputRef} // Attach ref to the input field
          type="text"
          placeholder="Select items..."
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus} // Open dropdown when focused
          style={{
            width: "100%",
            padding: "8px 0",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        {isDropdownOpen && (
          <div
            ref={dropdownRef}
            style={{
              position: "absolute",
              top: "100%",
              left: "0",
              right: "0",
              maxHeight: "240px",
              overflowY: "auto",
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              borderRadius: "4px",
              zIndex: 100,
              boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)", // Added subtle shadow
            }}
          >
            {filteredData.map((item) => {
              const exists = selectedItems.some(
                (i) => i.id === item.id && i.name === item.name
              );
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  style={{
                    padding: "8px 12px", // Reduced padding for more compact items
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: exists ? "#e0e0e0" : "#fff",
                    transition: "background-color 0.3s ease", // Smooth background transition
                    fontSize: "14px", // Slightly smaller font size
                    gap: "10px", // Tighten the space between the checkmark and text
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px", // Slightly bigger checkmark
                      color: exists ? "#333" : "#ccc", // Checkmark color
                    }}
                  >
                    {exists ? "✔" : ""}
                  </span>
                  <span style={{ fontSize: "14px", color: "#333" }}>
                    {item.name}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelect;
