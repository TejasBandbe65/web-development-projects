package com.cms.services;

import java.time.LocalDateTime;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cms.dao.BlogDao;
import com.cms.dao.UserDao;
import com.cms.dto.BlogDto;
import com.cms.models.Blog;
import com.cms.models.User;

@Service
public class BlogServiceImpl implements BlogService {
	
	@Autowired
	private BlogDao bdao;
	
	@Autowired
	private ModelMapper mapper;
	
	@Autowired
	private UserDao udao;

	@Override
	public String saveBlog(BlogDto blog) {
		
		User user = udao.findById(blog.getUserId()).orElse(null);
		
		if(user != null) {
			Blog mappedBlog = mapper.map(blog, Blog.class);
			mappedBlog.setUpdated_timestamp(LocalDateTime.now());
			
			mappedBlog.setUser(user);
			try {
				bdao.save(mappedBlog);
				return "Blog Added";
			}
			catch(Exception e) {
				return "Blog not added";
			}
		}
		else {
			return "User not found";
		}
	}

	@Override
	public List<Blog> showBlogs() {
		
		return bdao.findAll();
	}
	
	
	
}
