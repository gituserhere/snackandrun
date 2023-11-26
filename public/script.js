function previewImage() {
  var selectedSnack = document.getElementById('SnackSelection').value;
  var imagePreview = document.getElementById('imagePreview');
  var snackImage = document.getElementById('snackImage');
  var imagePath;

  console.log("previewImage: ", selectedSnack);

  // Assign image path based on selected snack
  switch (selectedSnack) {
    case 'Peanut Butter Waffle':
      imagePath = 'pictures/peanut_butter_waffle.jpg'; 
      break;
    case 'Chocolate cookie (medium)':
      imagePath = 'pictures/chocolate_cookie.jpg'; 
      break;
    case "Auntie Anne's Cinnamon Sugar Pretzel":
      imagePath = 'pictures/cinnamon_sugar_pretzel.jpg';
      break;
    case "Haagen Dazs 100ml":
      imagePath = 'pictures/ice_cream.png';
      break;
    case "Curry Puff":
      imagePath = 'pictures/curry_puff.jpg';
      break;
    // Add more cases for other snacks as needed
    default:
      imagePath = 'pictures/snacks.jpg'; // Replace with a default image path
  }

  // Update image source and show the preview
  snackImage.src = imagePath;
  imagePreview.classList.remove('hidden');
}