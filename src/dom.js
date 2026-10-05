export const createElement = (tagName, className = '', text = undefined) => {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
};

export const createButton = (label, className, ariaLabel = label) => {
  const button = createElement('button', className, label);
  button.type = 'button';
  button.setAttribute('aria-label', ariaLabel);
  return button;
};
