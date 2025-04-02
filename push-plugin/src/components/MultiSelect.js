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
  const [preventQueryClear, setPreventQueryClear] = useState(false);

  useEffect(() => {
    setFlattenedData(flattenData(data));
  }, [data]);

  // First, add a meta tag in your HTML to prevent zooming
  useEffect(() => {
    const metaViewport = document.querySelector('meta[name="viewport"]');
    if (!metaViewport) {
      const meta = document.createElement("meta");
      meta.name = "viewport";
      meta.content =
        "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no";
      document.head.appendChild(meta);
    }
  }, []);

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
        if (!preventQueryClear) {
          setQuery("");
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [preventQueryClear]);

  const handleSelect = (item) => {
    setPreventQueryClear(true);
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
    setTimeout(() => {
      setPreventQueryClear(false);
    }, 200);
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

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setIsDropdownOpen(true);
    }
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
        {selectedItems.length > 0 && (
          <button
            onClick={() => setSelectedItems([])}
            style={{
              border: "none",
              background: "transparent",
              color: "#666",
              cursor: "pointer",
              fontSize: "16px",
              padding: "5px",
              display: "flex",
              alignItems: "center",
              marginLeft: "4px",
            }}
            title="Clear all" // Adds tooltip on hover
          >
            🗑️
          </button>
        )}
      </div>

      {/* Autocomplete MultiSelect */}
      <div style={{ position: "relative" }}>
        <div
          style={{ position: "relative", width: "100%", marginBottom: "10px" }}
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Select items..."
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            style={{
              width: "100%",
              padding: "8px",
              paddingRight: "30px", // Make room for arrow
              border: "1px solid #ccc",
              borderRadius: "5px",
              resize: "none",
              outline: "none",
              boxSizing: "border-box",
              cursor: "pointer", // Add pointer cursor to entire input
              fontSize: "16px", // iOS minimum font size to prevent zoom
            }}
          />
          <button
            type="button"
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#666",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0",
              fontSize: "inherit",
            }}
            onClick={() => {
              inputRef.current.focus();
              setIsDropdownOpen(true);
            }}
            aria-label="Toggle dropdown"
          >
            ▼
          </button>
        </div>

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
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  style={{
                    width: "100%",
                    padding: "4px 8px", // Reduced padding
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: exists ? "#e0e0e0" : "#fff",
                    transition: "background-color 0.3s ease",
                    fontSize: "16px", // Match input font size
                    gap: "8px", // Reduced gap
                    border: "none",
                    outline: "none",
                    textAlign: "left",
                    height: "32px", // Reduced height
                    boxSizing: "border-box",
                    minHeight: "32px", // Add minimum height
                    lineHeight: "1.2", // Add line height to control text spacing
                    touchAction: "manipulation", // Prevent double-tap zoom
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      width: "14px", // Fixed width for checkmark
                      fontSize: "12px", // Smaller checkmark
                      color: exists ? "#333" : "#ccc",
                      textAlign: "center", // Center the checkmark
                    }}
                  >
                    {exists ? "✓" : ""} {/* Changed to simpler checkmark */}
                  </span>
                  <span
                    style={{
                      fontSize: "14px",
                      color: "#333",
                      flex: 1, // Take remaining space
                    }}
                  >
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(MultiSelect);
