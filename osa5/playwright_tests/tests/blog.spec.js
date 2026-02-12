const { test, expect, beforeEach, describe } = require('@playwright/test')
const { createBlog, loginWith } = require('./helpers')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Toivo',
        username: 'tope',
        password: 'salainen'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await page.getByText('log in').click()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      loginWith(page,'tope','salainen')
      await expect(page.getByText('Toivo logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page,'toope','salainen')
      const errorDiv = page.getByText('Invalid username or password')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
    })
  })

    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            await loginWith(page,'tope','salainen')
            await page.getByText('Toivo logged in').waitFor()
        })

        test('a new blog can be created', async ({ page }) => {
            await createBlog(page,{
                author:"Joku Testaaja",
                title:"Testaajan manifesti",
                url:"sir.tester.org"
            })
            await page.getByText('a new blog Testaajan manifesti by Joku Testaaja added succesfully').waitFor()
            expect(page.getByText("Testaajan manifesti by Joku Testaajaview")).toBeVisible()
        })
        describe('after blog is created', ()=>{
            beforeEach(async ({ page }) => {
                await createBlog(page,{
                    author:"Joku Testaaja",
                    title:"Testaajan manifesti",
                    url:"sir.tester.org"
                })
                await page.getByRole('button',{name:'view'}).click()
        })
            test('a blog can be liked', async ({ page }) => {
                const expected_likes=0
                expect(page.getByText(`Likes: ${expected_likes} like`)).toBeVisible()
                await page.getByRole('button',{name:'like'}).click()
                expect(page.getByText(`Likes: ${expected_likes+1} like`)).toBeVisible()
            })

            test('a blog can be deleted', async ({ page }) => {
                page.on('dialog', dialog => console.log(dialog.message()))
                page.on('dialog', dialog => dialog.accept()
                )

                await page.getByRole('button',{name:'delete'}).click()
                expect(page.getByText("Title: Testaajan manifesti")).not.toBeVisible()
            })
            test('a blog can only be deleted by its creator', async ({page,request}) => {
                const userdata ={
                        name: 'Joku Muu',
                        username: 'eitope',
                        password: 'salainen'
                    }
                await request.post('/api/users', {
                    data:userdata
                })
                await page.getByRole('button',{name:'logout'}).click()
                await page.getByLabel('username').fill(userdata.username)
                await page.getByLabel('password').fill(userdata.password)
                await page.getByRole('button', { name: 'login' }).click()
                await page.getByRole('button',{name:'view'}).click()
                expect(page.getByRole('button',{name:'delete'})).not.toBeVisible()
            })
            test('blogs are ordered by likes', async ({page})=>{
                let likes=[]
                await page.getByRole('button',{name:'like'}).click()
                await page.getByRole('button',{name:'like'}).click()
                await page.getByRole('button',{name:'hide'}).click()
                await createBlog(page,{
                    author:"Joku Testaaja",
                    title:"Testaajan manifesti 2",
                    url:"sir.tester.org"
                })
                await createBlog(page,{
                    author:"Firman pomo",
                    title:"Miksi testaus kannattaa tehdä tuotannossa",
                    url:"testausonturhaa.fi"
                })
                await page.getByRole('button',{name:'view'}).nth(1).click()
                await page.getByRole('button',{name:'like'}).click()
                await page.getByRole('button',{name:'like'}).click()
                await page.getByRole('button',{name:'like'}).click()
                await page.getByRole('button',{name:'like'}).click()
                await page.goto('/')
                await page.getByRole('button',{name:'view'}).first().click()
                await page.getByRole('button',{name:'view'}).first().click()
                await page.getByRole('button',{name:'view'}).first().click()
                const likes_locators = await page.getByTestId('likes').all()
                for (const like of await likes_locators){
                    
                    likes.push(parseInt(await like.textContent()))
                }
                expect(likes[0]).toBeGreaterThan(likes[1])
                expect(likes[1]).toBeGreaterThan(likes[2])

            })
        })
    })
})