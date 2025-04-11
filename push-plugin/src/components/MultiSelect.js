import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";

const MultiSelect = ({
  data,
  selectedItems,
  setSelectedItems,
  showValidation,
  onSelect,
}) => {
  const [query, setQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const [preventQueryClear, setPreventQueryClear] = useState(false);

  // Memoize filtered data
  const filteredData = useMemo(
    () =>
      query
        ? data.filter((item) =>
            item.name.toLowerCase().includes(query.toLowerCase())
          )
        : data,
    [query, data]
  );

  // Memoize handlers
  const handleSelect = useCallback(
    (item) => {
      if (showValidation) {
        onSelect();
      }
      setPreventQueryClear(true);
      if (selectedItems.some((i) => i.id === item.id)) {
        setSelectedItems(
          selectedItems.filter((selected) => selected.id !== item.id)
        );
      } else {
        setSelectedItems([...selectedItems, item]);
      }
      setTimeout(() => {
        setPreventQueryClear(false);
      }, 200);
    },
    [showValidation, onSelect, selectedItems, setSelectedItems]
  );

  const handleRemoveItem = useCallback(
    (itemToRemove) => {
      setSelectedItems(selectedItems.filter((item) => item !== itemToRemove));
    },
    [selectedItems, setSelectedItems]
  );

  const handleInputChange = useCallback((e) => {
    setQuery(e.target.value);
    setIsDropdownOpen(true);
  }, []);

  // Use cleanup for event listeners
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

    // Use capture phase for better performance
    document.addEventListener("mousedown", handleClickOutside, true);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside, true);
  }, [preventQueryClear]);

  // Remove viewport meta tag on unmount
  useEffect(() => {
    const metaViewport = document.querySelector('meta[name="viewport"]');
    if (!metaViewport) {
      const meta = document.createElement("meta");
      meta.name = "viewport";
      meta.content =
        "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no";
      document.head.appendChild(meta);
    }

    return () => {
      const addedMeta = document.querySelector('meta[name="viewport"]');
      if (addedMeta) {
        addedMeta.remove();
      }
    };
  }, []);

  const handleInputFocus = () => {
    setIsDropdownOpen(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setIsDropdownOpen(true);
    }
  };

  return (
    <div style={{ paddingBottom: "10px" }}>
      <label
        htmlFor="tags-input"
        style={{
          display: "block",
          marginBottom: "5px",
        }}
      >
        Push Tags
      </label>

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
                width="16"
                height="16"
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
              pointerEvents: "auto",
            }}
            title="Clear all"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ pointerEvents: "none" }}
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

      <div
        style={{
          position: "relative",
          borderBottom: `1px solid #999`,
        }}
      >
        <div style={{ position: "relative", width: "100%" }}>
          {showValidation && (
            <span
              style={{
                position: "absolute",
                right: "30px",
                top: "2px",
                fontSize: "10px",
                color: "#dc3545",
                lineHeight: "1",
                pointerEvents: "none",
              }}
            >
              *select tags
            </span>
          )}
          <input
            id="tags-input"
            ref={inputRef}
            type="text"
            placeholder="Find Tags"
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            style={{
              fontSize: "14px",
              width: "100%",
              padding: "8px",
              paddingRight: "30px",
              border: showValidation ? "1px solid #dc3545" : "none",
              outline: "none",
              boxSizing: "border-box",
              backgroundColor: showValidation ? "#fff8f8" : "transparent",
            }}
          />
          <button
            type="button"
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%) rotate(180deg)",
              fontSize: "12px",
              color: "#666",
              cursor: "pointer",
              background: "none",
              border: "none",
              padding: 0,
            }}
            onClick={() => inputRef.current.focus()}
            aria-label="Focus input"
          >
            ▲
          </button>
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
              boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            {filteredData.map((item) => {
              const exists = selectedItems.some((i) => i.id === item.id);
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
                    padding: "4px 8px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: exists ? "rgba(9,171,0,.2)" : "#fff",
                    transition: "background-color 0.3s ease",
                    fontSize: "14px",
                    gap: "8px",
                    border: "none",
                    outline: "none",
                    textAlign: "left",
                    height: "32px",
                    boxSizing: "border-box",
                    minHeight: "32px",
                    lineHeight: "1.2",
                    touchAction: "manipulation",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      width: "14px",
                      fontSize: "14px",
                      color: exists ? "#333" : "#ccc",
                      textAlign: "center",
                    }}
                  >
                    {exists ? "✓" : ""}
                  </span>
                  <span
                    style={{
                      fontSize: "14px",
                      color: "#333",
                      flex: 1,
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

// Memoize the entire component with custom comparison
export default React.memo(MultiSelect, (prevProps, nextProps) => {
  return (
    prevProps.data === nextProps.data &&
    prevProps.selectedItems === nextProps.selectedItems &&
    prevProps.showValidation === nextProps.showValidation
  );
});
