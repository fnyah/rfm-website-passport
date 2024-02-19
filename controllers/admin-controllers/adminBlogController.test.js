const { prepareBlogData } = require('./adminBlogController');

describe('prepareBlogData', () => {
  it('should return the prepared blog data', () => {
    const req = {
      body: {
        title: 'Test Blog',
        description: 'This is a test blog',
      },
      files: [
        { filename: 'image1.jpg' },
        { filename: 'image2.jpg' },
      ],
    };

    const additionalData = {
      author: 'John Doe',
    };

    const expectedOutput = {
      title: 'Test Blog',
      description: 'This is a test blog',
      filename: ['image1.jpg', 'image2.jpg'],
      links: [],
      author: 'John Doe',
    };

    const result = prepareBlogData(req, additionalData);

    expect(result).toEqual(expectedOutput);
  });

  it('should handle additional links', () => {
    const req = {
      body: {
        title: 'Test Blog',
        description: 'This is a test blog',
        link: 'https://example.com,https://google.com',
      },
      files: [
        { filename: 'image1.jpg' },
      ],
    };

    const expectedOutput = {
      title: 'Test Blog',
      description: 'This is a test blog',
      filename: ['image1.jpg'],
      links: ['https://example.com', 'https://google.com'],
    };

    const result = prepareBlogData(req);

    expect(result).toEqual(expectedOutput);
  });
});