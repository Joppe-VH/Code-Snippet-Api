document.addEventListener("DOMContentLoaded", function () {
  const sortSelect = document.getElementById("language-input");

  sortSelect.addEventListener("change", function () {
    const selectedValue = this.value;
    const currentUrl = new URL(window.location.href);

    // Remove existing sort and order params and reset page
    currentUrl.searchParams.delete("language");
    currentUrl.searchParams.delete("page");

    // Add new params based on selection
    if (selectedValue !== "default") {
      currentUrl.searchParams.set("language", selectedValue);
    }

    window.location.href = currentUrl.href;
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const sortSelect = document.getElementById("tags-input");

  sortSelect.addEventListener("change", function () {
    const selectedValue = this.value;
    const currentUrl = new URL(window.location.href);

    // Remove existing sort and order params and reset page
    currentUrl.searchParams.delete("tags");
    currentUrl.searchParams.delete("page");

    // Add new params based on selection
    if (selectedValue !== "default") {
      currentUrl.searchParams.set("tags", selectedValue);
    }

    window.location.href = currentUrl.href;
  });
});
