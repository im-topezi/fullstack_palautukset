import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'



test('<BlogForm /> calls the create function with the right parameters', async() => {

        const blog = {
            title: 'Component testing is done with react-testing-library',
            author: 'test_dev',
            url: 'testes.com',
            likes: '0',
            user:{username:'Nobody'}
        }
        const user = userEvent.setup()
        const createBlog = vi.fn()
        const ref=vi.fn()
        render(<BlogForm createBlog={createBlog} ref={ref}/>)
        const author = screen.getByPlaceholderText('Author')
        const title = screen.getByPlaceholderText('Title')
        const url = screen.getByPlaceholderText('URL')
        const saveButton = screen.getByText('save')

        await user.type(author,blog.author)
        await user.type(title, blog.title)
        await user.type(url,blog.url)
        await user.click(saveButton)

        expect(createBlog.mock.calls).toHaveLength(1)
        expect(createBlog.mock.calls[0][0].author).toBe(blog.author)
        expect(createBlog.mock.calls[0][0].title).toBe(blog.title)
        expect(createBlog.mock.calls[0][0].url).toBe(blog.url)

 })


