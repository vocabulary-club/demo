package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

	@GetMapping("/")
	public String home(Model model) {
		return "home";
	}

	@GetMapping("/manage")
	public String manage(Model model) {
		model.addAttribute("pv", "manage");
		return "manage";
	}

	@GetMapping("/about")
	public String about(Model model) {
		return "about";
	}
	
}
