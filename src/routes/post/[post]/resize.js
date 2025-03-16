let snapToBiggestHeight;

export function resize(element) {
	const top = document.createElement('div');
	top.direction = 'north';
	top.classList.add('grabber');
	top.classList.add('top');
	top.classList.add('sm:hidden');

	let active = null,
		initialRect = null,
		initialPos = null,
		lastY = null;
	let targetHeights = [];
	let minHeight, maxTop;

	function getEventY(event) {
		return event.pageY ? event.pageY : event.changedTouches[0].pageY;
	}

	function calculateTargetHeights() {
		const screenHeight = window.innerHeight;
		targetHeights = [screenHeight * 0.22, screenHeight * 0.5, screenHeight].map((height) =>
			Math.max(height, 150)
		);

		minHeight = screenHeight * 0.22;
		maxTop = screenHeight - minHeight - 20;
	}

	function calculateClosestHeight(currentHeight, direction) {
		let closestHeight;

		if (direction < 0) {
			// Moving up
			closestHeight = targetHeights.find((h) => h > currentHeight);
			if (!closestHeight) {
				closestHeight = targetHeights[targetHeights.length - 1];
			}
		} else if (direction > 0) {
			// Moving down
			closestHeight = targetHeights.slice().reverse().find((h) => h < currentHeight);
			if (!closestHeight) {
				closestHeight = targetHeights[0];
			}
		}

		return closestHeight;
	}

	function snapToClosestHeight() {
		const currentTop = parseFloat(element.style.top);
		const currentHeight = parseFloat(element.style.height);
		let currentBottom = currentTop + currentHeight;

		let direction = 0;
		if (lastY !== null && initialPos !== null) {
			direction = lastY - initialPos.y;
		}

		const closestHeight = calculateClosestHeight(currentHeight, direction);

		element.style.transition =
			'top 0.2s ease-out, height 0.2s ease-out, margin-inline 0.2s ease-out, border-radius 0.2s ease-out';
		if (closestHeight === targetHeights[targetHeights.length - 1]) {
			element.style.marginInline = `0`;
			element.style.top = `0`;
			element.style.borderRadius = `0`;
			element.style.height = `${closestHeight}px`;
		} else {
			element.style.marginInline = `calc(var(--spacing)* 2)`;
			element.style.borderRadius = `1.5rem`;
			element.style.top = `${currentBottom - closestHeight}px`;
			element.style.height = `${closestHeight}px`;
		}

		setTimeout(() => {
			element.style.transition = '';
		}, 200);
	}

	function resetState() {
		if (active) active.classList.remove('selected');
		active = null;
		initialRect = null;
		initialPos = null;
		lastY = null;
	}

	let lastTimestamp;

	function onMousedown(event) {
		active = event.target;
		const rect = element.getBoundingClientRect();
		initialRect = { top: rect.top, height: rect.height };
		initialPos = { y: getEventY(event) };
		lastY = initialPos.y;
		lastTimestamp = Date.now();
		active.classList.add('selected');
		element.style.transition = 'margin-inline 0.2s ease-out, border-radius 0.2s ease-out';
		element.style.marginInline = `calc(var(--spacing)* 2)`;
		element.style.borderRadius = `1.5rem`;
		if (parseFloat(element.style.height) === targetHeights[targetHeights.length -1]) {
			element.style.height = parseFloat(element.style.height) - 20 + "px";
			initialRect = { top: rect.top, height: rect.height - 20 };
		}

		setTimeout(() => {
			element.style.transition = '';
		}, 200);
	}

	function onMouseup() {
		if (!active) return;
		snapToClosestHeight();
		resetState();
	}

	function onMove(event) {
		if (!active) return;

		const currentY = getEventY(event);
		let delta = initialPos.y - currentY;
		let newTop = initialRect.top - delta;
		let newHeight = initialRect.height + delta;

		newTop = Math.max(0, Math.min(newTop, maxTop));

		const newBottom = newTop + newHeight;

		if (newBottom > window.innerHeight) {
			newHeight = window.innerHeight - newTop;
		}

		newHeight = Math.max(minHeight, newHeight);

		element.style.top = `${newTop}px`;
		element.style.height = `${newHeight}px`;
		lastY = currentY;
	}

	calculateTargetHeights();
	element.appendChild(top);
	top.addEventListener('mousedown', onMousedown);
	top.addEventListener('touchstart', onMousedown);

	window.addEventListener('mousemove', onMove);
	window.addEventListener('touchmove', onMove);
	window.addEventListener('mouseup', onMouseup);
	window.addEventListener('touchend', onMouseup);
	window.addEventListener('resize', calculateTargetHeights);

	snapToBiggestHeight = () => {
		element.style.transition =
			'top 0.2s ease-out, height 0.2s ease-out, margin-inline 0.2s ease-out, border-radius 0.2s ease-out';
		element.style.marginInline = `0`;
		element.style.top = `0`;
		element.style.borderRadius = `0`;
		element.style.height = `${window.innerHeight}px`;

		setTimeout(() => {
			element.style.transition = '';
		}, 200);
	};

	return {
		destroy() {
			window.removeEventListener('mousemove', onMove);
			window.removeEventListener('mousedown', onMousedown);
			window.removeEventListener('mouseup', onMouseup);
			window.removeEventListener('touchend', onMouseup);
			window.removeEventListener('resize', calculateTargetHeights);
			if (element.contains(top)) {
				element.removeChild(top);
			}
		}
	};
}

export { snapToBiggestHeight };
