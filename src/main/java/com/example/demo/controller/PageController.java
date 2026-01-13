package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

	@GetMapping("/")
	public String home(Model model) {
		model.addAttribute("pv", "manage");
		return "home";
	}

	@GetMapping("/manage")
	public String manage(Model model) {
		model.addAttribute("pv", "manage");
		return "manage";
	}

	@GetMapping("/check")
	public String check(Model model) {
		model.addAttribute("pv", "check");
		return "check";
	}

	@GetMapping("/test")
	public String test(Model model) {
		model.addAttribute("pv", "test");
		return "test";
	}
	
}
