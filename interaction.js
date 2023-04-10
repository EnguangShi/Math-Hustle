// Interaction
function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  event.dataTransfer.setData("text", event.target.id);
  event.dataTransfer.setData("sourceParent", event.target.parentElement.id);
}

function drop(event) {
  event.preventDefault();
  let data = event.dataTransfer.getData("text");
  let sourceParentId = event.dataTransfer.getData("sourceParent");
  let source = document.getElementById(data);
  let sourceParent = document.getElementById(sourceParentId);

  // Get the target cell element
  let targetCell = event.target;
  while (!targetCell.classList.contains("cell")) {
    targetCell = targetCell.parentElement;
  }

  if (targetCell.classList.contains("cell")) {
    // If the destination cell is empty, move the dragged item
    if (targetCell.childNodes.length === 0) {
      targetCell.appendChild(source);
    } else {
      // If the destination cell is not empty, switch the items
      let destinationItem = targetCell.childNodes[0];
      targetCell.replaceChild(source, destinationItem);
      if (sourceParent) {
        sourceParent.appendChild(destinationItem);
      }
    }
  }

  // Recalculate the result
  calculateResult();
}

function dropInventory(event) {
  event.preventDefault();
  let data = event.dataTransfer.getData("text");
  let source = document.getElementById(data);
  let sourceParent = document.getElementById(
    event.dataTransfer.getData("sourceParent")
  );

  // Only allow items from cells to be dropped into the inventory
  if (sourceParent && sourceParent.classList.contains("cell")) {
    if (event.target.nodeName === "SPAN") {
      // If the target is an item in the inventory, place the selected item back in the inventory
      let destinationItem = event.target;
      let destinationParent = destinationItem.parentElement;
      destinationParent.appendChild(source);
    } else {
      // If the target is the inventory itself, place the selected item back in the inventory
      event.target.appendChild(source);
    }
    calculateResult();
  }
}

let selectedElement = null;

function selectElement(event) {
  // Deselect previously selected element
  if (selectedElement) {
    selectedElement.classList.remove("selected");
  }

  let targetElement = event.target;

  // If clicking on a cell containing an item, select the item inside
  if (
    targetElement.classList.contains("cell") &&
    targetElement.childNodes.length > 0
  ) {
    targetElement = targetElement.firstChild;
  } else if (targetElement.parentElement.id === "inventory") {
    // If clicking on an item in the inventory, select it
    targetElement = event.target;
  }

  // If clicking on an item, select it
  if (targetElement.classList.contains("item")) {
    selectedElement = targetElement;
    selectedElement.classList.add("selected");
  } else {
    selectedElement = null;
  }
}

function placeSelectedElement(event) {
  if (selectedElement) {
    let target = event.target;

    // Get the target cell element or inventory element
    while (!target.classList.contains("cell") && target.id !== "inventory") {
      target = target.parentElement;
    }

    if (target.classList.contains("cell")) {
      // If the target cell is empty, place the selected item
      if (target.childNodes.length === 0) {
        target.appendChild(selectedElement);
      } else {
        // If the target cell is not empty, switch the items
        let destinationItem = target.childNodes[0];
        let sourceParent = selectedElement.parentElement;
        target.replaceChild(selectedElement, destinationItem);
        sourceParent.appendChild(destinationItem);
      }
    } else if (target.id === "inventory") {
      // If the target is the inventory and the selected item is in a cell, switch the items
      if (selectedElement.parentElement.classList.contains("cell")) {
        if (event.target.nodeName === "SPAN") {
          let destinationItem = event.target;
          let sourceParent = selectedElement.parentElement;
          target.replaceChild(selectedElement, destinationItem);
          sourceParent.appendChild(destinationItem);
        } else {
          target.appendChild(selectedElement);
        }
      }
    }

    // Deselect the element after placing it
    selectedElement.classList.remove("selected");
    selectedElement = null;

    // Recalculate the result
    calculateResult();
  }
}

document.addEventListener("click", (event) => {
  let target = event.target;
  if (
    target.classList.contains("cell") ||
    target.classList.contains("item") ||
    target.classList.contains("inventory")
  ) {
    if (selectedElement) {
      placeSelectedElement(event);
    } else {
      selectElement(event);
    }
  }
});

function addMoney(event) {
  let clickedElement = event.target;
  let cell;

  if (clickedElement.parentElement.classList.contains("cell")) {
    cell = clickedElement.parentElement;
  } else if (clickedElement.classList.contains("cell")) {
    cell = clickedElement;
  } else {
    return;
  }

  if (cell.childNodes.length > 0) {
    let cellContent = cell.textContent;
    let cellValue = parseFloat(cellContent);
    if (!isNaN(cellValue)) {
      totalMoney += cellValue;
      document.getElementById("totalMoney").innerHTML = `$${totalMoney}`;
    }
  }
}
