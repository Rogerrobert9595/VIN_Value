async function loadRecent() {
  const list = document.getElementById('recent-list');
  if (!list) return;
  const res = await fetch('/api/recent');
  if (!res.ok) return;
  const items = await res.json();
  list.innerHTML = '';
  for (const item of items) {
    const div = document.createElement('div');
    div.className = 'flex items-center gap-4 bg-[#141b1f] px-4 min-h-[72px] py-2';
    div.innerHTML = `
      <div class="text-white flex items-center justify-center rounded-lg bg-[#2b3840] shrink-0 size-12" data-icon="Car" data-size="24px" data-weight="regular">
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256"><path d="M240,112H229.2L201.42,49.5A16,16,0,0,0,186.8,40H69.2a16,16,0,0,0-14.62,9.5L26.8,112H16a8,8,0,0,0,0,16h8v80a16,16,0,0,0,16,16H64a16,16,0,0,0,16-16V192h96v16a16,16,0,0,0,16,16h24a16,16,0,0,0,16-16V128h8a8,8,0,0,0,0-16ZM69.2,56H186.8l24.89,56H44.31ZM64,208H40V192H64Zm128,0V192h24v16Zm24-32H40V128H216ZM56,152a8,8,0,0,1,8-8H80a8,8,0,0,1,0,16H64A8,8,0,0,1,56,152Zm112,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H176A8,8,0,0,1,168,152Z"></path></svg>
      </div>
      <div class="flex flex-col justify-center">
        <p class="text-white text-base font-medium leading-normal line-clamp-1">VIN: ${item.vin}</p>
        <p class="text-[#9db1be] text-sm font-normal leading-normal line-clamp-2">${item.description}</p>
      </div>`;
    list.appendChild(div);
  }
}

async function search(query) {
  if (!query) return;
  try {
    const res = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({query})
    });
    if (!res.ok) throw new Error('Not found');
    const data = await res.json();
    alert(`Value: $${data[0].value}`);
    loadRecent();
  } catch (err) {
    alert('Vehicle not found');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadRecent();
  const input = document.querySelector('input');
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      search(input.value);
    }
  });
});
