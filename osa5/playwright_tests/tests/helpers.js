const loginWith = async (page, username, password)  => {
  await page.getByRole('button', { name: 'log in' }).click()
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}


const createBlog = async (page, content) => {
  await page.getByRole('button', { name: 'add new blog' }).click()
  await page.getByPlaceholder('Author').fill(content.author)
  await page.getByPlaceholder('Title').fill(content.title)
  await page.getByPlaceholder('URL').fill(content.url)
  await page.getByRole('button', { name: 'save' }).click()
}


export { loginWith, createBlog }