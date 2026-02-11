import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'



describe('<Blog /> ...', () => {
    beforeEach(()=>{
        const blog = {
            title: 'Component testing is done with react-testing-library',
            author: 'test_dev',
            url: 'testes.com',
            likes: '0',
            user:{username:'Nobody'}
        }

        render(<Blog blog={blog} user={{username:'Nobody'}}/>)

    })




    test('Basic info only visible', ()=>{
        const title = screen.getAllByText('Component testing is done with react-testing-library')
        expect(title[0]).toBeVisible()
        expect(title[1]).not.toBeVisible()
    })

    test('Additional info is shown when button is pressed',async()=>{
        const user= userEvent.setup()
        const button = screen.getByText('view')
        await user.click(button)
        const title = screen.getAllByText('Component testing is done with react-testing-library')
        expect(title[1]).toBeVisible()
        expect(title[0]).not.toBeVisible()
    })

    test('If like is pressed twice, the event handler is called twice',async()=>{
        const blog = {
            title: 'Like this blog',
            author: 'test_dev',
            url: 'testes.com',
            likes: '0',
            user:{username:'Nobody'}
        }
        const likeBlog= vi.fn()

        render(<Blog blog={blog} user={{username:'Nobody'}} addLike={likeBlog}/>)
        const user= userEvent.setup()
        const viewButton = screen.getAllByText('view')
        await user.click(viewButton[1])
        const likeButton = screen.getAllByText('like')
        await user.click(likeButton[1])
        await user.click(likeButton[1])

        expect(likeBlog.mock.calls).toHaveLength(2)


        
    })

})