package com.cms.services;

import java.util.List;

import com.cms.dto.BlogDto;
import com.cms.models.Blog;


public interface BlogService {
	
	public String saveBlog(BlogDto blog);
	
	public List<Blog> showBlogs();
	
	public List<BlogDto> getTopBlogs();
	
	public BlogDto getBlogById(long id);
}
