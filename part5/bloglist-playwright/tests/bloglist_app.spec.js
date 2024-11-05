const { test, describe, beforeEach, expect } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

  // make test to ensure the app shows login form by default
describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // empty db here
    // create a user for backend here
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'My single testuser',
        username: 'testuser',
        password: 'testuser'
      }
    })
    await page.goto('')
  })

  test('Login form is shown', async ({ page }) => {
    await expect (page.getByTestId('username')).toBeVisible()
    await expect (page.getByTestId('password')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'testuser', 'testuser')
      await expect(page.getByText('My single testuser logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'testuser', 'wrong')

      const errorDiv = await page.locator('.error')
      await expect(errorDiv).toContainText('wrong username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
      await expect(await page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'testuser', 'testuser')
    })
  
    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'a playwright title', 'playwright author', 'playwright url', true)
      await expect(page.locator('p.title:has-text("a playwright title")')).toBeVisible
    })

    test('an existing blog can be liked', async ({ page }) => {
      await page.locator('ul').filter({ hasText: 'a playwright title playwright author view' }).getByRole('button').click()
      await page.getByRole('button', { name: 'like' }).first().click()
    })

    test('user who added the blog can delete the blog', async ({ page }) => {
      await page.locator('ul').filter({ hasText: 'a playwright title playwright author view' }).getByRole('button').click()
      page.once('dialog', dialog => {
        console.log(`Dialog message: ${dialog.message()}`)
        dialog.accept().catch(() => {})
      })
      await page.getByRole('button', { name: 'remove' }).click()
      const blogPost = await page.locator('p.title:has-text("a playwright title")')
      await expect(blogPost).toBeHidden()
      
      // await page.getByRole('button', { name: 'remove' }).first().click()
      // page.on('dialog', dialog => dialog.accept())
      // await expect(page.locator('p.title:has-text("a playwright title")')).toBeHidden()
    })

    test('only user who added the blog sees the blogs delee button', async ({ page }) => {
      await page.locator('ul').filter({ hasText: 'HTML is easy' }).getByRole('button').click() 
      
      const removeButton = await page.locator('button', { hasText: 'remove' })
      await expect(removeButton).not.toBeVisible()
    })

    test('blogs are arranged in descending order in terms of likes', async ({ page }) => {
      // click view for all blogposts
      await page.waitForTimeout(2000)

      await page.locator('ul').filter({ hasText: 'This is a blogpost jane view' }).getByRole('button').click();
      await page.locator('ul').filter({ hasText: 'HTML is easy jack view' }).getByRole('button').click();
      await page.locator('ul').filter({ hasText: 'testomng graaaaah view' }).getByRole('button').click();
      await page.locator('ul').filter({ hasText: 'My favorite recipe Jessie view' }).getByRole('button').click();
      await page.getByRole('button', { name: 'view' }).click();
      
      const likeElems = await page.locator('p', { hasText: 'likes:' })
      console.log('like elements: ', likeElems)

      // remove 'likes: ', cast to Int, then save to array
      const likes = await likeElems.evaluateAll(elems => elems.map(elem => {
        const maybeNr = elem.textContent.replace('likes: ', '')
        return maybeNr.length >= 1 ? parseInt(maybeNr, 10) : 0
      }))
      console.log('likes: ', likes)

      // check if index i+1 is <= index i -> if yes, descending order, else ascending (wrong)
      for (let i = 0; i < likes.length - 1; i++)
        expect(likes[i] >= likes[i+1])
    })
  })
})