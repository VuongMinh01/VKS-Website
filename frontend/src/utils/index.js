const host = "https://vks-website.onrender.com/api";
export const loginRoute = `${host}/users/login`;
export const registerRoute = `${host}/users/register`;
export const getUserByIdRoute = `${host}/users/`;
export const updateUserRoute = `${host}/users/`;
export const deleteUserRoute = `${host}/users/`;

export const addCongVanRoute = `${host}/congvan/add`;        // Thêm công văn
export const deleteCongVanRoute = `${host}/congvan/delete/`; // Xóa công văn (cần thêm ID)
export const updateCongVanRoute = `${host}/congvan/update/`; // Cập nhật công văn (cần thêm ID)
export const searchCongVanRoute = `${host}/congvan/search`;

export const addKhoHang = `${host}/khohang/add`;
export const deleteKhoHang = `${host}/khohang/delete/`;
export const updateKhoHang = `${host}/khohang/update/`;
export const searchKhoHang = `${host}/khohang/search`;

export const addSanPham = `${host}/khohang/add`;
export const deleteSanPham = `${host}/sanpham/delete/`;
export const updateSanPham = `${host}/sanpham/update/`;
export const searchSanPham = `${host}/sanpham/search`;