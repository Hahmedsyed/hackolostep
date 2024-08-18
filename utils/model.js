import * as tf from '@tensorflow/tfjs';

// Example: Create a simple model for text classification
export async function createModel() {
  const model = tf.sequential();

  model.add(tf.layers.dense({ inputShape: [7], units: 100, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 3, activation: 'softmax' })); // Assume 3 classes: Headings, Paragraphs, Images

  model.compile({
    optimizer: tf.train.adam(),
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });

  return model;
}

// Example function to predict the category
export async function predictCategory(model, text) {
  // Convert text to character codes
  let charCodes = text.split('').map(char => char.charCodeAt(0));

  // Pad or truncate to ensure length is 7
  if (charCodes.length > 7) {
    charCodes = charCodes.slice(0, 7);  // Truncate if too long
  } else if (charCodes.length < 7) {
    while (charCodes.length < 7) {
      charCodes.push(0);  // Pad with zeros if too short
    }
  }

  const inputTensor = tf.tensor([charCodes], [1, 7]);

  const prediction = model.predict(inputTensor);
  const category = prediction.argMax(-1).dataSync()[0];

  // Map the category index to a label
  const categories = ['Headings', 'Paragraphs', 'Images'];
  return categories[category];
}
