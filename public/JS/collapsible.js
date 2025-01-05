function toggleCollapsible(id) {
  const content = document.getElementById(id);
  const icon = document.getElementById(`${id}-icon`);

  if (content.classList.contains("hidden")) {
    content.classList.remove("hidden"); // Show the content
    icon.classList.replace("ph-caret-down", "ph-caret-up"); // Update icon
  } else {
    content.classList.add("hidden"); // Hide the content
    icon.classList.replace("ph-caret-up", "ph-caret-down"); // Update icon
  }
}
