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
      <label style={{ fontSize: "14px" }}>Push Tags</label>

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
              padding: "0 10px",
              display: "flex",
              alignItems: "center",
              fontSize: "14px",
              height: "32px",
              borderRadius: "4px",
              boxSizing: "border-box",
            }}
          >
            {item.name}
            <button
              onClick={() => handleRemoveItem(item)}
              style={{
                marginLeft: "8px",
                cursor: "pointer",
                border: "none",
                background: "transparent",
                padding: 0,
                display: "flex",
                alignItems: "center",
                height: "32px",
              }}
            >
              <svg
                width="16" // Reduced from 24
                height="16" // Reduced from 24
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 18L18 6M6 6L18 18"
                  stroke="#444"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </span>
        ))}
        {selectedItems.length > 0 && (
          <button
            onClick={() => setSelectedItems([])}
            style={{
              marginLeft: "8px",
              cursor: "pointer",
              border: "none",
              background: "transparent",
              padding: 0,
              display: "flex",
              alignItems: "center",
              height: "32px",
              pointerEvents: "auto", // This ensures only cursor change on hover
            }}
            title="Clear all"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ pointerEvents: "none" }} // This prevents any hover effects on the SVG
            >
              <path
                d="M20 5H9.37727C9.0269 5 8.69017 5.14684 8.44873 5.40723L3.70711 10.4072C3.31658 10.8215 3.31658 11.4547 3.70711 11.8689L8.44873 16.8689C8.69017 17.1293 9.0269 17.2762 9.37727 17.2762H20C20.5523 17.2762 21 16.8285 21 16.2762V6C21 5.44772 20.5523 5 20 5Z"
                stroke="#444"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 9L12 13M12 9L16 13"
                stroke="#444"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Autocomplete MultiSelect */}
      <div style={{ position: "relative" }}>
        <div style={{ position: "relative", width: "100%" }}>
          {/* Input field */}
          <input
            ref={inputRef}
            type="text"
            placeholder="Find Tags"
            value={query}
            onChange={handleInputChange}
            onFocus={(e) => {
              handleInputFocus();
            }}
            onKeyDown={handleKeyDown}
            style={{
              fontSize: "14px",
              width: "100%",
              padding: "8px",
              paddingRight: "30px",
              border: "none",
              borderBottom: "1px solid #999",
              outline: "none",
              boxSizing: "border-box",
              transition: "border-color 0.2s ease",
            }}
          />
          {/* Dropdown arrow */}
          <span
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%) rotate(180deg)", // Added rotate to make ▲ appear as V
              fontSize: "12px", // Reduced from 14px
              color: "#666",
              cursor: "pointer",
            }}
            onClick={() => inputRef.current.focus()}
          >
            ▲
          </span>
        </div>

        {isDropdownOpen && (
          <div
            ref={dropdownRef}
            style={{
              backgroundColor: "#f8f8f8",
              position: "absolute",
              top: "100%",
              left: "0",
              right: "0",
              maxHeight: "240px",
              overflowY: "auto",
              border: "1px solid #09ab00",
              borderTop: "1px solid #09ab00",
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
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(9,171,0,.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = exists
                      ? "rgba(9,171,0,.2)"
                      : "#fff";
                  }}
                  style={{
                    width: "100%",
                    padding: "4px 8px", // Reduced padding
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: exists ? "rgba(9,171,0,.2)" : "#fff",
                    transition: "background-color 0.3s ease",
                    fontSize: "14px", // Match input font size
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
                      fontSize: "14px", // Smaller checkmark
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
