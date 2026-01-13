package com.example.demo.service;

import com.example.demo.repository.HomeRepository;
import com.example.demo.repository.ManageRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class HomeService {

    private final HomeRepository homeRepository;
    private final ManageRepository manageRepository;

    public HomeService(HomeRepository homeRepository, ManageRepository manageRepository) {
        this.homeRepository = homeRepository;
        this.manageRepository = manageRepository;
    }

    public Object select(Map<String, Object> data) {

        Map<String, Object> lastRegDate = null;

        String strDate = data.get("day").toString();
        if(strDate.equals("last")) {

            lastRegDate = homeRepository.getLastRegDate();

        } else if(strDate.equals("second last")) {

            lastRegDate = homeRepository.getSecondLastRegDate();

        } else if(strDate.equals("third last")) {

            lastRegDate = homeRepository.getThirdLastRegDate();

        }

        return homeRepository.select(lastRegDate);
    }

}
