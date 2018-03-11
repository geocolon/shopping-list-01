'use strict';
/* global store $, cuid */

// eslint-disable-next-line no-unused-vars
const bookmarks = (function(){

  function generateItemElement(item) {
    let itemTitle = `<span class="bookmarks-app-item bookmarks-app-item__checked">${item.title}</span>`;
    if (!item.checked) {
      itemTitle = `
        <form id="js-edit-item">
          <input class="bookmarks-app-item type="text" value="${item.name}" />
        </form>
      `;
    }
  
    return `
      <li class="js-item-element" data-item-id="${item.id}">
        ${itemTitle}
        <div class="bookmarks-app-item-controls">
          <button class="bookmarks-app-item-toggle js-item-toggle">
            <span class="button-label">check</span>
          </button>
          <button class="bookmarks-app-item-delete js-item-delete">
            <span class="button-label">delete</span>
          </button>
        </div>
      </li>`;
  }
  
  
  function generateBookmarksItemsString(bookmarks) {
    const items = bookmarks.map((item) => generateItemElement(item));
    return items.join('');
  }
  
  
  function render() {
    // Filter item list if store prop is true by item.checked === false
    let  = store.bookmarks;
    if (store.hideCheckedItems) {
      items = bookmarks.items.filter(item => !item.checked);
    }
  
    // Filter item list if store prop `searchTerm` is not empty
    if (store.searchTerm) {
      items = store.items.filter(item => item.name.includes(store.searchTerm));
    }
  
    // render the bookmarks-app list in the DOM
    console.log('`render` ran');
    const bookmarksItemsString = generateBookmarksItemsString(items);
  
    // insert that HTML into the DOM
    $('.js-bookmarks-app').html(bookmarksItemsString);
  }
  
  
  function addItemToBookmarks(bookmarkName, urlName, details, ratingVal) {
    this.bookmarks.push({ id: cuid(), title: bookmarkName, url: urlName, desc: details, rating: ratingVal});
  }
  
  function handleNewItemSubmit() {
    $('#js-bookmarks-app-form').submit(function (event) {
      event.preventDefault();
      const newBookmarkName = $('#js-bookmarks-title').val();
      $('#js-bookmarks-title').val('');
      const urlName = $('#js-bookmarks-url').val();
      $('#js-bookmarks-url').val('');
      const details = $('#js-bookmarks-description').val();
      $('#js-bookmarks-description').val('');
      const ratingVal = $('#js-bookmarks-rating').val();
      $('#js-bookmarks-rating').val('');
      addItemToBookmarks( newBookmarkName, urlName, details, ratingVal );
      render();
    });
  }
  
  function toggleCheckedForListItem(id) {
    const foundItem = store.items.find(item => item.id === id);
    foundItem.checked = !foundItem.checked;
  }
  
  
  function getItemIdFromElement(item) {
    return $(item)
      .closest('.js-item-element')
      .data('item-id');
  }
  
  function handleItemCheckClicked() {
    $('.js-shopping-list').on('click', '.js-item-toggle', event => {
      const id = getItemIdFromElement(event.currentTarget);
      toggleCheckedForListItem(id);
      render();
    });
  }
  
  function deleteListItem(id) {
    const index = store.items.findIndex(item => item.id === id);
    store.items.splice(index, 1);
  }
  
  function editListItemName(id, itemName) {
    const item = store.items.find(item => item.id === id);
    item.name = itemName;
  }
  
  function toggleCheckedItemsFilter() {
    store.hideCheckedItems = !store.hideCheckedItems;
  }
  
  function setSearchTerm(val) {
    store.searchTerm = val;
  }
  
  
  function handleDeleteItemClicked() {
    // like in `handleItemCheckClicked`, we use event delegation
    $('.js-bookmarks-app').on('click', '.js-item-delete', event => {
      // get the index of the item in store.items
      const id = getItemIdFromElement(event.currentTarget);
      // delete the item
      deleteListItem(id);
      // render the updated bookmarks-app list
      render();
    });
  }
  
  function handleEditBookmarksItemSubmit() {
    $('.js-bookmarks-app').on('submit', '#js-edit-item', event => {
      event.preventDefault();
      const id = getItemIdFromElement(event.currentTarget);
      const itemName = $(event.currentTarget).find('.bookmarks-app-item').val();
      editListItemName(id, itemName);
      render();
    });
  }
  
  function handleToggleFilterClick() {
    $('.js-filter-checked').click(() => {
      toggleCheckedItemsFilter();
      render();
    });
  }
  
  function handleBookmarksSearch() {
    $('.js-bookmarks-app-search-entry').on('keyup', event => {
      const val = $(event.currentTarget).val();
      setSearchTerm(val);
      render();
    });
  }
  
  function bindEventListeners() {
    handleNewItemSubmit();
    handleItemCheckClicked();
    handleDeleteItemClicked();
    handleEditBookmarksItemSubmit();
    handleToggleFilterClick();
    handleBookmarksSearch();
  }

  // This object contains the only exposed methods from this module:
  return {
    render: render,
    bindEventListeners: bindEventListeners,
  };
}());
