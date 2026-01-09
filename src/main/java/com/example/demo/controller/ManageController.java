package com.example.demo.controller;

import com.example.demo.service.ManageService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/manage")
public class ManageController {

    private final ManageService manageService;

    public ManageController(ManageService manageService) {

        this.manageService = manageService;
    }

    @GetMapping("/getVocDic")
    public Object getVocDic() {

        return manageService.getVocDic();
    }
	
}