package com.cms.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cms.dao.UserDao;
import com.cms.models.Role;
import com.cms.models.User;
import com.cms.utility.utilities;

@Service
public class UserServiceImpl implements UserService {
	
	@Autowired
	private UserDao udao;
	
	@Autowired
	private utilities u;

	@Override
	public String registerUser(User user) {
		
		try {
			String salt = u.generateSaltValue(6);
			user.setSalt(salt);
			user.setRole(Role.ROLE_USER);
			user.setImage("https://cdn-icons-png.flaticon.com/128/3135/3135715.png");
			String password = user.getPassword();
			user.setPassword(u.encryptPassword(password, salt));
			udao.save(user);
			return "User registered successfully";
		}catch(Exception e){
			return e.toString();
		}
	}

}
