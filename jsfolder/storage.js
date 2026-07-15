// LocalStorage 관리 파일

// ===== Storage key =====
const STORAGE_KEY = {
    TODOS: 'flowdash-todos',
    THEME: 'flowdash-theme',
    NICKNAME: 'flowdash-nickname',
    PROFILE_COLOR: "flowdash-profile-color"
    // FILTER: 'flowdash-filter', // 선택사항
    // SORT: 'flowdash-sort' // 선택사항
}

// ===== Todo =====
export function loadTodos() {
    // LocalStorage에서 todos 데이터를 가져와서 반환
    const todos = localStorage.getItem(STORAGE_KEY.TODOS);

    return todos ? JSON.parse(todos) : [];
}

export function saveTodos(todos) {
    // LocalStorage에 todos 데이터를 저장
    localStorage.setItem(
        STORAGE_KEY.TODOS,
        JSON.stringify(todos)
    )
}

// ===== Theme =====
export function loadTheme() {
    return localStorage.getItem(STORAGE_KEY.THEME);    
}

export function saveTheme(theme) {
    localStorage.setItem(STORAGE_KEY.THEME, theme);
}

// ===== Nickname =====
export function loadNickname() {
    return localStorage.getItem(STORAGE_KEY.NICKNAME);
}

export function saveNickname(nickname) {
    localStorage.setItem(STORAGE_KEY.NICKNAME, nickname);
}

// === Profile ===
export function loadProfileColor() {
    return localStorage.getItem(STORAGE_KEY.PROFILE_COLOR);
}

export function saveProfileColor(color) {
    localStorage.setItem(STORAGE_KEY.PROFILE_COLOR, color);
}

// ===== Filter =====
export function loadFilter() {
    // LocalStorage에서 filter 데이터를 가져와서 반환
}

export function saveFilter(filter) {
    // LocalStorage에 filter 데이터를 저장
}

// ===== Sort =====
export function loadSort() {
    // LocalStorage에서 sort 데이터를 가져와서 반환
}

export function saveSort(sort) {
    // LocalStorage에 sort 데이터를 저장
}