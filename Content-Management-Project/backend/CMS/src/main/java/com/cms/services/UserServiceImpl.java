package com.cms.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cms.dao.UserDao;
import com.cms.models.User;

@Service
public class UserServiceImpl implements UserService {
	
	@Autowired
	private UserDao udao;

	@Override
	public String registerUser(User user) {
		
		try {
			user.setRole("ROLE_USER");
			udao.save(user);
			return "Usre registered successfully";
		}catch(Exception e){
			return "Something went wrong";
		}
	}

}
