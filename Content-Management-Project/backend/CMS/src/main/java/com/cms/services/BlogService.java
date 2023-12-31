package com.cms.services;

import com.cms.dto.BlogDto;
import com.cms.models.Blog;

public interface BlogService {
	
	public String saveBlog(BlogDto blog);
}
